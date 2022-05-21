import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { VsphereDatastore } from '../../types';
import { Entities } from '../constants';

export function createDatastoreEntity(datastore: VsphereDatastore): Entity {
  return createIntegrationEntity({
    entityData: {
      source: datastore,
      assign: {
        _key: `vsphere_datastore:${datastore.datastore}`,
        _type: Entities.DATASTORE._type,
        _class: Entities.DATASTORE._class,
        datastore: datastore.datastore,
        name: datastore.name,
        type: datastore.type,
        freeSpace: datastore.free_space,
        capacity: datastore.capacity,
        // Unknown based on the response. DataStore can be encrypted however
        // You can enable encryption on the storage volumes that you create in virtual storage area network (vSAN), virtual machine file system (VMFS), and network file system (NFS) datastores.
        classification: null,
        encrypted: null,
      },
    },
  });
}
