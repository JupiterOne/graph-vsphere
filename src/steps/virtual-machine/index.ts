import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createVmEntity } from './converter';

export async function fetchVms({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateVms(async (vm) => {
    await jobState.addEntity(createVmEntity(vm));
  });
}

export const vmSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.VM,
    name: 'Fetch Virtual Machine',
    entities: [Entities.VIRTUAL_MACHINE],
    relationships: [],
    dependsOn: [Steps.HOST],
    executionHandler: fetchVms,
  },
];
