import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { getOrCreateAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createClusterEntity } from './converter';

export async function fetchClusters({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = getOrCreateAPIClient(instance.config, logger);

  await apiClient.iterateClusters(async (cluster) => {
    await jobState.addEntity(createClusterEntity(cluster));
  });
}

export const clusterSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.CLUSTER,
    name: 'Fetch Cluster',
    entities: [Entities.CLUSTER],
    relationships: [],
    dependsOn: [Steps.DATA_CENTER],
    executionHandler: fetchClusters,
  },
];
