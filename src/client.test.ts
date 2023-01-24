jest.setTimeout(500000);
import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../test/config';
import { Recording, setupProjectRecording } from '../test/recording';
import { createAPIClient } from './client';

const apiClient = createAPIClient(
  integrationConfig,
  createMockIntegrationLogger(),
);

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('iterate-vms', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-vms',
  });

  await apiClient.iterateVms(() => {
    return Promise.resolve();
  });
});

test('get-vm', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'get-vm',
  });

  // TODO (adam-in-ict) is there a better way than hardcoding these?
  const ids = ['vm-22', 'vm-23', 'vm-43', 'vm-44'];

  for (const id of ids) {
    await apiClient.getVm(id);
  }
});

test('get-vm-guest', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'get-vm-guest',
  });

  const ids = ['vm-22', 'vm-23', 'vm-43', 'vm-44'];

  for (const id of ids) {
    await apiClient.getVmGuest(id);
  }
});

test('iterate-hosts', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-hosts',
  });

  await apiClient.iterateHosts(() => {
    return Promise.resolve();
  });
});

test('iterate-networks', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-networks',
  });

  await apiClient.iterateNetworks(() => {
    return Promise.resolve();
  });
});

test('iterate-datastores', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-datastores',
  });

  await apiClient.iterateDatastores(() => {
    return Promise.resolve();
  });
});

test('get-datastore', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'get-datastore',
  });

  const ids = ['datastore-17', 'datastore-48'];

  for (const id of ids) {
    await apiClient.getDatastore(id);
  }
});

test('iterate-datacenter', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-datacenter',
  });

  await apiClient.iterateDatacenters(() => {
    return Promise.resolve();
  });
});

test('get-datacenter', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'get-datacenter',
  });

  const ids = ['datacenter-3'];

  for (const id of ids) {
    await apiClient.getDatacenter(id);
  }
});

test('iterate-cluster', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-cluster',
  });

  await apiClient.iterateClusters(() => {
    return Promise.resolve();
  });
});

test('get-cluster', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'get-cluster',
  });

  const ids = ['domain-c43'];

  for (const id of ids) {
    await apiClient.getCluster(id);
  }
});

test('iterate-namespace', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-namespace',
  });

  await apiClient.iterateNamespaces(() => {
    return Promise.resolve();
  });
});

test('iterate-distributed-switch', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-distributed-switch',
  });

  // TEMP: clusterId provided for recording
  await apiClient.iterateDistributedSwitches('domain-c43', () => {
    return Promise.resolve();
  });
});

test('auth-failure', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'auth-failure',
    options: {
      recordFailedRequests: true,
      matchRequestsBy: {
        url: {
          hostname: false,
        },
      },
    },
  });

  const config = {
    ...integrationConfig,
    user: 'invalidUser',
    password: 'invalidpass',
  };
  const apiClient = createAPIClient(config, createMockIntegrationLogger());
  try {
    await apiClient.iterateVms(() => {
      return Promise.resolve();
    });
  } catch {
    return;
  }
});

test('invalid-cluster-query-distributed-switches', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'invalid-cluster-query-distributed-switches',
    options: {
      recordFailedRequests: true,
      matchRequestsBy: {
        url: {
          hostname: false,
        },
      },
    },
  });
  try {
    // TEMP: invalid clusterId provided for recording
    await apiClient.iterateDistributedSwitches('invalid', () => {
      return Promise.resolve();
    });
  } catch {
    return;
  }
});
