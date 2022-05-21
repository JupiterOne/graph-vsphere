import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { VsphereNetwork } from '../../types';
import { Entities } from '../constants';

export function getNetworkKey(id: string) {
  return `vsphere_network:${id}`;
}

export function createNetworkEntity(network: VsphereNetwork): Entity {
  return createIntegrationEntity({
    entityData: {
      source: network,
      assign: {
        _key: getNetworkKey(network.network),
        _type: Entities.NETWORK._type,
        _class: Entities.NETWORK._class,
        name: network.name,
        type: network.type,
        network: network.network,
        CIDR: '0.0.0.0',
        // TODO: to be somehow read
        public: true,
        internal: true,
      },
    },
  });
}
