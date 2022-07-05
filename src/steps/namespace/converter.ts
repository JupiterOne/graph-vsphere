import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { VsphereNamespace } from '../../types';
import { Entities } from '../constants';

export function createNamespaceEntity(namespace: VsphereNamespace): Entity {
  return createIntegrationEntity({
    entityData: {
      source: namespace,
      assign: {
        _key: `vsphere_namespace:${namespace.namespace}`,
        _type: Entities.NAMESPACE._type,
        _class: Entities.NAMESPACE._class,
        name: namespace.namespace,
        displayName: namespace.namespace,
        controlPlaneApiServerPort: namespace.control_plane_api_server_port,
        masterHost: namespace.master_host,
        namespace: namespace.namespace,
      },
    },
  });
}
