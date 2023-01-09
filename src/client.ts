import fetch, { Response } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import {
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
  VsphereHost,
  VsphereNamespace,
  VsphereNetwork,
  VsphereVm,
  VsphereVmDetails,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}
  private baseUri = `https://${this.config.domain}/api/`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;
  private sessionId = '';

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

  private async getSessionId(): Promise<string> {
    const uri = this.withBaseUri('session');
    if (!this.sessionId) {
      try {
        const sanitizedLogin = this.config.login.replace(
          /[\u{0080}-\u{FFFF}]/gu,
          '',
        );
        const sanitizedPassword = this.config.password.replace(
          /[\u{0080}-\u{FFFF}]/gu,
          '',
        );
        console.log(
          `Sanitized `,
          this.config.login.length - sanitizedLogin.length,
          ` LOGIN characters`,
        );
        console.log(
          `Sanitized `,
          this.config.password.length - sanitizedPassword.length,
          ` PASSWORD characters`,
        );
        const res: Response = await fetch(uri, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${sanitizedLogin}:${sanitizedPassword}`,
            ).toString('base64')}`,
          },
        });
        this.checkStatus(res);
        const sessionId = await res.json();
        this.sessionId = sessionId;
      } catch (err) {
        if (err.body) {
          console.log(`Additional logging: `, err.body);
        }
        throw new IntegrationProviderAPIError({
          endpoint: uri,
          status: err.status,
          statusText: err.statusText,
        });
      }
    }
    return this.sessionId;
  }

  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri('vcenter/vm');
    try {
      await this.request(uri);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each host resource in the provider.
   *
   * @param iteratee receives each host to produce entities/relationships
   */
  public async iterateHosts(
    iteratee: ResourceIteratee<VsphereHost>,
  ): Promise<void> {
    const hosts = await this.request(this.withBaseUri('vcenter/host'));
    for (const host of hosts) {
      await iteratee(host);
    }
  }

  /**
   * Iterates each vm resource in the provider.
   *
   * @param iteratee receives each vm to produce entities/relationships
   */
  public async iterateVms(
    iteratee: ResourceIteratee<VsphereVm>,
  ): Promise<void> {
    const vms = await this.request(this.withBaseUri('vcenter/vm'));
    for (const vm of vms) {
      await iteratee(vm);
    }
  }

  public async getVm(vmId: string): Promise<VsphereVmDetails> {
    return this.request(this.withBaseUri(`vcenter/vm/${vmId}`));
  }

  /**
   * Iterates each network resource in the provider.
   *
   * @param iteratee receives each network to produce entities/relationships
   */
  public async iterateNetworks(
    iteratee: ResourceIteratee<VsphereNetwork>,
  ): Promise<void> {
    const networks = await this.request(this.withBaseUri('vcenter/network'));
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
    const datastores = await this.request(
      this.withBaseUri('vcenter/datastore'),
    );
    for (const datastore of datastores) {
      await iteratee(datastore);
    }
  }

  public async getDatastore(
    datastoreId: string,
  ): Promise<VsphereDatastoreDetails> {
    return this.request(this.withBaseUri(`vcenter/datastore/${datastoreId}`));
  }

  /**
   * Iterates each datacenter resource in the provider.
   *
   * @param iteratee receives each datacenter to produce entities/relationships
   */
  public async iterateDatacenters(
    iteratee: ResourceIteratee<VsphereDatacenter>,
  ): Promise<void> {
    const datacenters = await this.request(
      this.withBaseUri('vcenter/datacenter'),
    );
    for (const datacenter of datacenters) {
      await iteratee(datacenter);
    }
  }

  public async getDatacenter(
    datacenterId: string,
  ): Promise<VsphereDatacenterDetails> {
    return this.request(this.withBaseUri(`vcenter/datacenter/${datacenterId}`));
  }

  /**
   * Iterates each cluster resource in the provider.
   *
   * @param iteratee receives each cluster to produce entities/relationships
   */
  public async iterateClusters(
    iteratee: ResourceIteratee<VsphereCluster>,
  ): Promise<void> {
    const clusters = await this.request(this.withBaseUri('vcenter/cluster'));
    for (const cluster of clusters) {
      await iteratee(cluster);
    }
  }

  public async getCluster(clusterId: string): Promise<VsphereClusterDetails> {
    return this.request(this.withBaseUri(`vcenter/cluster/${clusterId}`));
  }

  /**
   * Iterates each namespace resource in the provider.
   *
   * @param iteratee receives each namespace to produce entities/relationships
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

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
