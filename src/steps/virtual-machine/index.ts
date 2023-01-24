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
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await apiClient.iterateVms(async (vm) => {
    const vmGuest = await apiClient.getVmGuest(vm.vm as string);
    await jobState.addEntity(createVmEntity(vm, vmGuest));
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
