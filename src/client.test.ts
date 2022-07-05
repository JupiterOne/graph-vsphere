jest.setTimeout(500000);
import { integrationConfig } from '../test/config';
import { Recording, setupProjectRecording } from '../test/recording';
import { createAPIClient } from './client';

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

  const apiClient = createAPIClient(integrationConfig);
  await apiClient.iterateVms(() => {
    return Promise.resolve();
  });
});

test('get-vm', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'get-vm',
  });

  const apiClient = createAPIClient(integrationConfig);
  const ids = ['vm-20', 'vm-21', 'vm-22', 'vm-23', 'vm-24', 'vm-25'];

  for (const id of ids) {
    await apiClient.getVm(id);
  }
});

test('iterate-hosts', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-hosts',
  });

  const apiClient = createAPIClient(integrationConfig);
  await apiClient.iterateHosts(() => {
    return Promise.resolve();
  });
});

test('iterate-networks', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-networks',
  });

  const apiClient = createAPIClient(integrationConfig);
  await apiClient.iterateNetworks(() => {
    return Promise.resolve();
  });
});

test('iterate-datastores', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-datastores',
  });

  const apiClient = createAPIClient(integrationConfig);
  await apiClient.iterateDatastores(() => {
    return Promise.resolve();
  });
});

test('get-datastore', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'get-datastore',
  });

  const apiClient = createAPIClient(integrationConfig);
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

  const apiClient = createAPIClient(integrationConfig);
  await apiClient.iterateDatacenters(() => {
    return Promise.resolve();
  });
});

test('get-datacenter', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'get-datacenter',
  });

  const apiClient = createAPIClient(integrationConfig);
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

  const apiClient = createAPIClient(integrationConfig);
  await apiClient.iterateClusters(() => {
    return Promise.resolve();
  });
});

test('get-cluster', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'get-cluster',
  });

  const apiClient = createAPIClient(integrationConfig);
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

  const apiClient = createAPIClient(integrationConfig);
  await apiClient.iterateNamespaces(() => {
    return Promise.resolve();
  });
});

test('iterate-distributed-switch', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'iterate-distributed-switch',
  });

  const apiClient = createAPIClient(integrationConfig);
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
  const apiClient = createAPIClient(config);
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
  const apiClient = createAPIClient(integrationConfig);
  try {
    // TEMP: invalid clusterId provided for recording
    await apiClient.iterateDistributedSwitches('invalid', () => {
      return Promise.resolve();
    });
  } catch {
    return;
  }
});
