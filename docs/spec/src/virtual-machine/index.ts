import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const virtualMachineSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Fetch Entities
     */
    id: 'fetch-vm',
    name: 'Fetch Virtual Machine',
    entities: [
      {
        resourceName: 'Virtual Machine',
        _type: 'vsphere_vm',
        _class: ['Workload'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-host'],
    implemented: true,
  },
];
