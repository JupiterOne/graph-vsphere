import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { VsphereCluster } from '../../types';
import { Entities } from '../constants';

export function createClusterEntity(cluster: VsphereCluster): Entity {
  return createIntegrationEntity({
    entityData: {
      source: cluster,
      assign: {
        _key: `vsphere_cluster:${cluster.cluster}`,
        _type: Entities.CLUSTER._type,
        _class: Entities.CLUSTER._class,
        name: cluster.name,
        cluster: cluster.cluster,
        drsEnabled: cluster.drs_enabled,
        haEnabled: cluster.ha_enabled,
      },
    },
  });
}
