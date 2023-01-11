import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { VsphereHost } from '../../types';
import { Entities } from '../constants';

export function createHostEntity(host: VsphereHost): Entity {
  return createIntegrationEntity({
    entityData: {
      source: host,
      assign: {
        _key: `vsphere_host:${host.host}`,
        _type: Entities.HOST._type,
        _class: Entities.HOST._class,
        hostname: host.host,
        name: host.name,
        connectionState: host.connection_state,
        powerState: host.power_state,
      },
    },
  });
}
