import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { getOrCreateAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createHostEntity } from './converter';

export async function fetchHosts({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = getOrCreateAPIClient(instance.config, logger);

  await apiClient.iterateHosts(async (host) => {
    await jobState.addEntity(createHostEntity(host));
  });
}

export const hostSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.HOST,
    name: 'Fetch Host',
    entities: [Entities.HOST],
    relationships: [],
    dependsOn: [Steps.DATA_CENTER],
    executionHandler: fetchHosts,
  },
];
