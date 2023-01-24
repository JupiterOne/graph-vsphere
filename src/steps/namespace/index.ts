import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createNamespaceEntity } from './converter';

export async function fetchNamespaces({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await apiClient.iterateNamespaces(async (namespace) => {
    await jobState.addEntity(createNamespaceEntity(namespace));
  });
}

export const namespaceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.NAMESPACE,
    name: 'Fetch Namespace',
    entities: [Entities.NAMESPACE],
    relationships: [],
    dependsOn: [Steps.CLUSTER],
    executionHandler: fetchNamespaces,
  },
];
