import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createDatastoreEntity } from './converter';

export async function fetchDatastores({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateDatastores(async (datastore) => {
    await jobState.addEntity(createDatastoreEntity(datastore));
  });
}

export const datastoreSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DATASTORE,
    name: 'Fetch Datastores',
    entities: [Entities.DATASTORE],
    relationships: [],
    dependsOn: [Steps.HOST],
    executionHandler: fetchDatastores,
  },
];
