import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { VsphereVm } from '../../types';
import { Entities } from '../constants';

export function createVmEntity(vm: VsphereVm): Entity {
  return createIntegrationEntity({
    entityData: {
      source: vm,
      assign: {
        _key: `vsphere_vm:${vm.vm}`,
        _type: Entities.VIRTUAL_MACHINE._type,
        _class: Entities.VIRTUAL_MACHINE._class,
        memorySizeMiB: vm.memory_size_MiB,
        vm: vm.vm,
        name: vm.name,
        powerState: vm.power_state,
        cpuCount: vm.cpu_count,
      },
    },
  });
}
