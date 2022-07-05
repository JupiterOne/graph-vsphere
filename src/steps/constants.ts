import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  DATA_CENTER: 'fetch-data-center',
  CLUSTER: 'fetch-cluster',
  HOST: 'fetch-host',
  VM: 'fetch-vm',
  DATASTORE: 'fetch-datastore',
  NETWORK: 'fetch-network',
  DISTRIBUTED_SWITCH: 'fetch-distributed-switch',
  NAMESPACE: 'fetch-namespace',
  BUILD_VM_NETWORK: 'build-vm-network-relationship',
};

export const Entities: Record<
  | 'ACCOUNT'
  | 'DATA_CENTER'
  | 'CLUSTER'
  | 'HOST'
  | 'VIRTUAL_MACHINE'
  | 'NETWORK'
  | 'DISTRIBUTED_SWITCH'
  | 'NAMESPACE'
  | 'DATASTORE',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'vsphere_client',
    _class: ['Application'],
  },
  DATA_CENTER: {
    resourceName: 'Data Center',
    _type: 'vsphere_data_center',
    _class: ['Group'],
  },
  CLUSTER: {
    resourceName: 'Cluster',
    _type: 'vsphere_cluster',
    _class: ['Cluster'],
  },
  HOST: {
    resourceName: 'Host',
    _type: 'vsphere_host',
    _class: ['Host'],
  },
  VIRTUAL_MACHINE: {
    resourceName: 'Virtual Machine',
    _type: 'vsphere_vm',
    _class: ['Workload'],
  },
  DATASTORE: {
    resourceName: 'Datastore',
    _type: 'vsphere_datastore',
    _class: ['DataStore'],
  },
  NETWORK: {
    resourceName: 'Network',
    _type: 'vsphere_network',
    _class: ['Network'],
  },
  DISTRIBUTED_SWITCH: {
    resourceName: 'Distributed Switch',
    _type: 'vsphere_distributed_switch',
    _class: ['Configuration'],
  },
  NAMESPACE: {
    resourceName: 'Namespace',
    _type: 'vsphere_namespace',
    _class: ['Group'],
  },
};

export const Relationships: Record<
  | 'CLIENT_MANAGES_DATA_CENTER'
  | 'DATA_CENTER_CONTAINS_CLUSTER'
  | 'CLUSTER_CONTAINS_HOST'
  | 'HOST_CONTAINS_VM'
  | 'HOST_CONTAINS_DATASTORE'
  | 'HOST_CONTAINS_NETWORK'
  | 'HOST_CONTAINS_DISTRIBUTED_SWITCH'
  | 'VM_USES_DATASTORE'
  | 'VM_USES_NETWORK'
  | 'CLUSTER_USES_DISTRIBUTED_SWITCH'
  | 'CLUSTER_CONTAINS_NAMESPACE'
  | 'DATA_CENTER_CONTAINS_HOST',
  StepRelationshipMetadata
> = {
  CLIENT_MANAGES_DATA_CENTER: {
    _type: 'vsphere_client_manages_data_center',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.MANAGES,
    targetType: Entities.DATA_CENTER._type,
  },
  DATA_CENTER_CONTAINS_CLUSTER: {
    _type: 'vsphere_data_center_contains_cluster',
    sourceType: Entities.DATA_CENTER._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.CLUSTER._type,
  },
  DATA_CENTER_CONTAINS_HOST: {
    _type: 'vsphere_data_center_contains_host',
    sourceType: Entities.DATA_CENTER._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.HOST._type,
  },
  CLUSTER_CONTAINS_HOST: {
    _type: 'vsphere_cluster_contains_host',
    sourceType: Entities.CLUSTER._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.HOST._type,
  },
  HOST_CONTAINS_VM: {
    _type: 'vsphere_host_contains_vm',
    sourceType: Entities.HOST._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.VIRTUAL_MACHINE._type,
  },
  HOST_CONTAINS_DATASTORE: {
    _type: 'vsphere_host_contains_datastore',
    sourceType: Entities.HOST._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.DATASTORE._type,
  },
  HOST_CONTAINS_NETWORK: {
    _type: 'vsphere_host_contains_network',
    sourceType: Entities.HOST._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.NETWORK._type,
  },
  HOST_CONTAINS_DISTRIBUTED_SWITCH: {
    _type: 'vsphere_host_contains_distributed_switch',
    sourceType: Entities.HOST._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.DISTRIBUTED_SWITCH._type,
  },
  VM_USES_DATASTORE: {
    _type: 'vsphere_vm_uses_datastore',
    sourceType: Entities.VIRTUAL_MACHINE._type,
    _class: RelationshipClass.USES,
    targetType: Entities.DATASTORE._type,
  },
  VM_USES_NETWORK: {
    _type: 'vsphere_vm_uses_network',
    sourceType: Entities.VIRTUAL_MACHINE._type,
    _class: RelationshipClass.USES,
    targetType: Entities.NETWORK._type,
  },
  CLUSTER_CONTAINS_NAMESPACE: {
    _type: 'vsphere_cluster_contains_namespace',
    sourceType: Entities.CLUSTER._type,
    _class: RelationshipClass.CONTAINS,
    targetType: Entities.NAMESPACE._type,
  },
  CLUSTER_USES_DISTRIBUTED_SWITCH: {
    _type: 'vsphere_cluster_uses_distributed_switch',
    sourceType: Entities.CLUSTER._type,
    _class: RelationshipClass.USES,
    targetType: Entities.DISTRIBUTED_SWITCH._type,
  },
};
