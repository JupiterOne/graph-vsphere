import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { getOrCreateAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Steps, Entities, Relationships } from '../constants';
import { createDataCenterEntity } from './converter';

export async function fetchDatacenters({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = getOrCreateAPIClient(instance.config, logger);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateDatacenters(async (dataCenter) => {
    const dataCenterEntity = await jobState.addEntity(
      createDataCenterEntity(dataCenter),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.MANAGES,
        from: accountEntity,
        to: dataCenterEntity,
      }),
    );
  });
}

export const datacenterSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DATA_CENTER,
    name: 'Fetch Data Center',
    entities: [Entities.DATA_CENTER],
    relationships: [Relationships.CLIENT_MANAGES_DATA_CENTER],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchDatacenters,
  },
];
