import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const namespaceSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Fetch Entities
     */
    id: 'fetch-namespace',
    name: 'Fetch Namespace',
    entities: [
      {
        resourceName: 'Namespace',
        _type: 'vsphere_namespace',
        _class: ['Group'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-cluster'],
    implemented: true,
  },
];
