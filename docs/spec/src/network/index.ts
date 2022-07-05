import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const networkSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Fetch Entities
     */
    id: 'fetch-network',
    name: 'Fetch Network',
    entities: [
      {
        resourceName: 'Network',
        _type: 'vsphere_network',
        _class: ['Network'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-host'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build Child Relationship
     */
    id: 'build-vm-network-relationship',
    name: 'Build VM and Network Relationship',
    entities: [],
    relationships: [
      {
        _type: 'vsphere_vm_uses_network',
        sourceType: 'vsphere_vm',
        _class: RelationshipClass.USES,
        targetType: 'vsphere_network',
      },
    ],
    dependsOn: ['fetch-vm', 'fetch-network'],
    implemented: true,
  },
];
