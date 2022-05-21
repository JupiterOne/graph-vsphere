import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { VsphereDistributedSwitch } from '../../types';
import { Entities } from '../constants';

export function createDistributedSwitchKey(id: string): string {
  return `vsphere_distributed_switch:${id}`;
}

export function createDistributedSwitchEntity(
  distributedSwitch: VsphereDistributedSwitch,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: distributedSwitch,
      assign: {
        _key: createDistributedSwitchKey(distributedSwitch.distributed_switch),
        _type: Entities.DISTRIBUTED_SWITCH._type,
        _class: Entities.DISTRIBUTED_SWITCH._class,
        name: distributedSwitch.distributed_switch,
        compatible: distributedSwitch.compatible,
        incompatibilityReasons: distributedSwitch.incompatibility_reasons,
        distributedSwitch: distributedSwitch.distributed_switch,
        networkProvider: distributedSwitch.network_provider,
      },
    },
  });
}
