import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const clusterSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Fetch Entities
     */
    id: 'fetch-cluster',
    name: 'Fetch Cluster',
    entities: [
      {
        resourceName: 'Cluster',
        _type: 'vsphere_cluster',
        _class: ['Cluster'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-data-center'],
    implemented: true,
  },
];
