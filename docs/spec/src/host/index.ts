import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const hostSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Fetch Entities
     */
    id: 'fetch-host',
    name: 'Fetch Host',
    entities: [
      {
        resourceName: 'Host',
        _type: 'vsphere_host',
        _class: ['Host'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-data-center'],
    implemented: true,
  },
];
