import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { VsphereDatacenter } from '../../types';
import { Entities } from '../constants';

export function createDataCenterEntity(dataCenter: VsphereDatacenter): Entity {
  return createIntegrationEntity({
    entityData: {
      source: dataCenter,
      assign: {
        _key: `vsphere_datacenter:${dataCenter.datacenter}`,
        _type: Entities.DATA_CENTER._type,
        _class: Entities.DATA_CENTER._class,
        name: dataCenter.name,
        dataCenter: dataCenter.datacenter,
      },
    },
  });
}
