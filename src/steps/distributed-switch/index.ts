import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import {
  createDistributedSwitchEntity,
  createDistributedSwitchKey,
} from './converter';

export async function fetchDistributedSwitches({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.CLUSTER._type },
    async (clusterEntity) => {
      await apiClient.iterateDistributedSwitches(
        clusterEntity.cluster as string,
        async (distributedSwitch) => {
          const hasKey = await jobState.hasKey(
            createDistributedSwitchKey(distributedSwitch.distributed_switch),
          );

          if (!hasKey) {
            const distributedSwitchEntity = await jobState.addEntity(
              createDistributedSwitchEntity(distributedSwitch),
            );

            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.USES,
                from: clusterEntity,
                to: distributedSwitchEntity,
              }),
            );
          }
        },
      );
    },
  );
}

export const distributedSwitchSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DISTRIBUTED_SWITCH,
    name: 'Fetch Distributed Switch',
    entities: [Entities.DISTRIBUTED_SWITCH],
    relationships: [Relationships.CLUSTER_USES_DISTRIBUTED_SWITCH],
    dependsOn: [Steps.HOST, Steps.CLUSTER],
    executionHandler: fetchDistributedSwitches,
  },
];
