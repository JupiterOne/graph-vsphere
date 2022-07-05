import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const datastoreSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Fetch Entities
     */
    id: 'fetch-datastore',
    name: 'Fetch Datastores',
    entities: [
      {
        resourceName: 'Datastore',
        _type: 'vsphere_datastore',
        _class: ['DataStore'],
      },
    ],
    relationships: [],
    dependsOn: ['fetch-host'],
    implemented: true,
  },
];
