import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const distributedSwitchSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Fetch Entities
     */
    id: 'fetch-distributed-switch',
    name: 'Fetch Distributed Switch',
    entities: [
      {
        resourceName: 'Distributed Switch',
        _type: 'vsphere_distributed_switch',
        _class: ['Configuration'],
      },
    ],
    relationships: [
      {
        _type: 'vsphere_cluster_uses_distributed_switch',
        sourceType: 'vsphere_cluster',
        _class: RelationshipClass.USES,
        targetType: 'vsphere_distributed_switch',
      },
    ],
    dependsOn: ['fetch-host', 'fetch-cluster'],
    implemented: true,
  },
];
