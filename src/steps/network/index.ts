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
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await apiClient.iterateNetworks(async (network) => {
    await jobState.addEntity(createNetworkEntity(network));
  });
}

export async function buildVmNetworkRelationship({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config, logger);

  await jobState.iterateEntities(
    { _type: Entities.VIRTUAL_MACHINE._type },
    async (vmEntity) => {
      const vm = await apiClient.getVm(vmEntity.vm as string);
      for (const nics of Object.values(vm.nics)) {
        const networkEntity = await jobState.findEntity(
          getNetworkKey(nics.backing.network),
        );

        if (networkEntity) {
          const vmUsesNetwork = createDirectRelationship({
            _class: RelationshipClass.USES,
            from: vmEntity,
            to: networkEntity,
          });
          // We need to check that the relationship doesn't yet exist
          // for those instances where a VM has multiple nics on the
          // same network.
          if (!jobState.hasKey(vmUsesNetwork._key)) {
            await jobState.addRelationship(vmUsesNetwork);
          }
        }
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
