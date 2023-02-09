import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  VsphereCluster,
  VsphereClusterDetails,
  VsphereDatacenter,
  VsphereDatacenterDetails,
  VsphereDatastore,
  VsphereDatastoreDetails,
  VsphereDistributedSwitch,
  VsphereGuestInfo,
  VsphereGuestInfoDeprecated,
  VsphereHost,
  VsphereNamespace,
  VsphereNetwork,
  VsphereVersion,
  VsphereVm,
  VsphereVmDetails,
  VsphereVmDetailsDeprecated,
} from './types';

let client: APIClient;

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export type APIVersion = {
  major: number;
  minor: number;
  patch: number;
};

// Documentation for API endpoints:
// https://developer.vmware.com/apis/vsphere-automation/v7.0.0/vcenter/vcenter/

export class APIClient {
  constructor(
    readonly config: IntegrationConfig,
    readonly logger: IntegrationLogger,
  ) {}
  private apiVersion: APIVersion = {
    major: 0,
    minor: 0,
    patch: 0,
  };
  private versionEndpoint = `https://${this.config.domain}/rest/appliance/system/version/`;
  private baseUri = `https://${this.config.domain}/api/`;
  private baseUriDeprecated = `https://${this.config.domain}/rest/`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;
  private sessionId = '';

  private async version702orNewer() {
    const version = await this.getVersion();
    return (
      version.major >= 8 ||
      (version.major >= 7 && version.minor >= 0 && version.patch >= 2)
    );
  }
  private async version670orNewer() {
    const version = await this.getVersion();
    return version.major >= 7 || (version.major >= 6 && version.minor >= 7);
  }

  // Add ability to switch Base URI dependent on the version for endpoints
  // that are supported before version 7.0.2 but in a different format.
  private withVersionedBaseUri = async (path: string) => {
    if (await this.version702orNewer()) {
      return `${this.baseUri}${path}`;
    } else {
      return `${this.baseUriDeprecated}${path}`;
    }
  };

  private checkStatus = (response: Response) => {
    if (response.ok) {
      return response;
    } else {
      throw new IntegrationProviderAPIError(response);
    }
  };

  private async request(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<Response> {
    const sessionId = await this.getSessionId();
    try {
      const options = {
        method,
        headers: {
          'vmware-api-session-id': sessionId,
        },
      };

      // Handle rate-limiting
      const response = await retry(
        async () => {
          const res: Response = await fetch(uri, options);
          this.checkStatus(res);
          return res;
        },
        {
          delay: 5000,
          maxAttempts: 10,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            )
              context.abort();
          },
        },
      );
      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  // Versions before 7.0.2 wrapped their results in a "value" object
  private async versionedRequest(
    uri: string,
    method: 'GET' | 'HEAD' = 'GET',
  ): Promise<Response> {
    if (await this.version702orNewer()) {
      return await this.request(uri, method);
    } else {
      const result = await this.request(uri, method);
      return result.value;
    }
  }

  private async generateHostFilter(host: string): Promise<string> {
    if (await this.version702orNewer()) {
      return `hosts=${encodeURIComponent(host)}`;
    } else {
      return `filter.hosts=${encodeURIComponent(host)}`;
    }
  }

  private async getSessionId(): Promise<string> {
    const uri = this.withBaseUri('session');
    const uriDeprecated = `${this.baseUriDeprecated}com/vmware/cis/session`;
    if (!this.sessionId) {
      try {
        const res: Response = await fetch(uri, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.config.login}:${this.config.password}`,
            ).toString('base64')}`,
          },
        });
        this.checkStatus(res);
        const sessionId = await res.json();
        this.sessionId = sessionId;
      } catch (err) {
        this.logger.info(
          { uri },
          `Failed to authenticate.  Trying legacy session endpoint...`,
        );
      }
      try {
        // Next, try deprecated endpoint for backward compatibility
        const res: Response = await fetch(uriDeprecated, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.config.login}:${this.config.password}`,
            ).toString('base64')}`,
          },
        });
        this.checkStatus(res);
        const sessionId = await res.json();
        this.sessionId = sessionId.value;
        this.logger.info(`SUCCESS`, sessionId);
      } catch (newerr) {
        throw new IntegrationProviderAPIError({
          endpoint: uriDeprecated,
          status: newerr.status,
          statusText: newerr.statusText,
        });
      }
    }
    return this.sessionId;
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      // The version check requires authentication and is therefore
      // sufficient for testing.
      await this.getVersion();
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: this.versionEndpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async getVersion(): Promise<APIVersion> {
    if (this.apiVersion.major == 0) {
      const versionResponse: VsphereVersion = await this.request(
        this.versionEndpoint,
      );
      const versionArray = versionResponse.value.version.split('.');
      this.apiVersion.major = Number(versionArray[0]);
      this.apiVersion.minor = Number(versionArray[1]);
      this.apiVersion.patch = Number(versionArray[2]);

      this.logger.info(
        { apiVersion: this.apiVersion },
        `vSphere API version calculated`,
      );
    }
    return this.apiVersion;
  }

  /**
   * Iterates each host resource in the provider.
   *
   * @param iteratee receives each host to produce entities/relationships
   */
  public async iterateHosts(
    iteratee: ResourceIteratee<VsphereHost>,
  ): Promise<void> {
    const hosts = await this.versionedRequest(
      await this.withVersionedBaseUri('vcenter/host'),
    );
    for (const host of hosts) {
      await iteratee(host);
    }
  }

  /**
   * Iterates each vm resource in the provider.
   *
   * @param iteratee receives each vm to produce entities/relationships
   * @param host host to filter VMs by.  Large systems will otherwise hit the 4000 VM limit imposed by this endpoint.
   */
  public async iterateVms(
    iteratee: ResourceIteratee<VsphereVm>,
    host: string,
  ): Promise<void> {
    const vms = await this.versionedRequest(
      await this.withVersionedBaseUri(
        `vcenter/vm?${await this.generateHostFilter(host)}`,
      ),
    );
    for (const vm of vms) {
      await iteratee(vm);
    }
  }

  public async getVm(
    vmId: string,
  ): Promise<VsphereVmDetails | VsphereVmDetailsDeprecated> {
    return this.versionedRequest(
      await this.withVersionedBaseUri(`vcenter/vm/${vmId}`),
    );
  }

  public async getVmGuest(
    vmId: string,
  ): Promise<VsphereGuestInfo | VsphereGuestInfoDeprecated | null> {
    let vmGuestResponse;

    // Only perform a versioned request if we are at 6.7 or newer.  This
    // endpoint is not supported in versions before that.
    if (await this.version670orNewer()) {
      vmGuestResponse = await this.versionedRequest(
        await this.withVersionedBaseUri(`vcenter/vm/${vmId}/guest/identity`),
      );
    } else {
      this.logger.info(
        `Skipping query of vcenter/vm/${vmId}/guest/identity endpoint.  This is only available in versions 6.7 and newer.`,
      );
      vmGuestResponse = null;
    }
    return vmGuestResponse;
  }

  /**
   * Iterates each network resource in the provider.
   *
   * @param iteratee receives each network to produce entities/relationships
   */
  public async iterateNetworks(
    iteratee: ResourceIteratee<VsphereNetwork>,
  ): Promise<void> {
    const networks = await this.versionedRequest(
      await this.withVersionedBaseUri('vcenter/network'),
    );
    for (const network of networks) {
      await iteratee(network);
    }
  }

  /**
   * Iterates each datastore resource in the provider.
   *
   * @param iteratee receives each datastore to produce entities/relationships
   */
  public async iterateDatastores(
    iteratee: ResourceIteratee<VsphereDatastore>,
  ): Promise<void> {
    const datastores = await this.versionedRequest(
      await this.withVersionedBaseUri('vcenter/datastore'),
    );
    for (const datastore of datastores) {
      await iteratee(datastore);
    }
  }

  public async getDatastore(
    datastoreId: string,
  ): Promise<VsphereDatastoreDetails> {
    return this.versionedRequest(
      await this.withVersionedBaseUri(`vcenter/datastore/${datastoreId}`),
    );
  }

  /**
   * Iterates each datacenter resource in the provider.
   *
   * @param iteratee receives each datacenter to produce entities/relationships
   */
  public async iterateDatacenters(
    iteratee: ResourceIteratee<VsphereDatacenter>,
  ): Promise<void> {
    const datacenters = await this.versionedRequest(
      await this.withVersionedBaseUri('vcenter/datacenter'),
    );
    for (const datacenter of datacenters) {
      await iteratee(datacenter);
    }
  }

  public async getDatacenter(
    datacenterId: string,
  ): Promise<VsphereDatacenterDetails> {
    return this.versionedRequest(
      await this.withVersionedBaseUri(`vcenter/datacenter/${datacenterId}`),
    );
  }

  /**
   * Iterates each cluster resource in the provider.
   *
   * @param iteratee receives each cluster to produce entities/relationships
   */
  public async iterateClusters(
    iteratee: ResourceIteratee<VsphereCluster>,
  ): Promise<void> {
    const clusters = await this.versionedRequest(
      await this.withVersionedBaseUri('vcenter/cluster'),
    );
    for (const cluster of clusters) {
      await iteratee(cluster);
    }
  }

  public async getCluster(clusterId: string): Promise<VsphereClusterDetails> {
    return this.versionedRequest(
      await this.withVersionedBaseUri(`vcenter/cluster/${clusterId}`),
    );
  }

  /**
   * Iterates each namespace resource in the provider.
   *
   * @param iteratee receives each namespace to produce entities/relationships
   *
   * NOT SUPPORTED IN VERSIONS BEFORE 7.0.0
   */
  public async iterateNamespaces(
    iteratee: ResourceIteratee<VsphereNamespace>,
  ): Promise<void> {
    const namespaces = await this.request(
      this.withBaseUri('vcenter/namespaces-user/namespaces'),
    );
    for (const namespace of namespaces) {
      await iteratee(namespace);
    }
  }

  /**
   * Iterates each distributed switch resource in the provider.
   *
   * @param iteratee receives each distributed switch to produce entities/relationships
   *
   * NOT SUPPORTED IN VERSIONS BEFORE 7.0.0
   */
  public async iterateDistributedSwitches(
    clusterId: string,
    iteratee: ResourceIteratee<VsphereDistributedSwitch>,
  ): Promise<void> {
    const distributedSwitches = await this.request(
      this.withBaseUri(
        `vcenter/namespace-management/distributed-switch-compatibility?cluster=${clusterId}`,
      ),
    );
    for (const distributedSwitch of distributedSwitches) {
      await iteratee(distributedSwitch);
    }
  }
}

export function getOrCreateAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): APIClient {
  if (!client) {
    client = new APIClient(config, logger);
  }
  return client;
}
