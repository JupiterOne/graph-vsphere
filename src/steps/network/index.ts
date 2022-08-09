import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createNetworkEntity, getNetworkKey } from './converter';

export async function fetchNetworks({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateNetworks(async (network) => {
    await jobState.addEntity(createNetworkEntity(network));
  });
}

export async function buildVmNetworkRelationship({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.VIRTUAL_MACHINE._type },
    async (vmEntity) => {
      const vm = await apiClient.getVm(vmEntity.vm as string);
      for (const nics of Object.values(vm.nics)) {
        const networkEntity = await jobState.findEntity(
          getNetworkKey(nics.backing.network),
        );

        if (networkEntity)
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.USES,
              from: vmEntity,
              to: networkEntity,
            }),
          );
      }
    },
  );
}

export const networkSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.NETWORK,
    name: 'Fetch Network',
    entities: [Entities.NETWORK],
    relationships: [],
    dependsOn: [Steps.HOST],
    executionHandler: fetchNetworks,
  },
  {
    id: Steps.BUILD_VM_NETWORK,
    name: 'Build VM and Network Relationship',
    entities: [],
    relationships: [Relationships.VM_USES_NETWORK],
    dependsOn: [Steps.VM, Steps.NETWORK],
    executionHandler: buildVmNetworkRelationship,
  },
];
