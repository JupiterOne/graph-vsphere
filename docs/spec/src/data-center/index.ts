import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const dataCenterSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Fetch Entities
     */
    id: 'fetch-data-center',
    name: 'Fetch Data Center',
    entities: [
      {
        resourceName: 'Data Center',
        _type: 'vsphere_data_center',
        _class: ['Group'],
      },
    ],
    relationships: [
      {
        _type: 'vsphere_client_manages_data_center',
        sourceType: 'vsphere_client',
        _class: RelationshipClass.MANAGES,
        targetType: 'vsphere_data_center',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
