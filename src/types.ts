export type VsphereVm = {
  memory_size_MiB: number;
  vm: string;
  name: string;
  power_state: string;
  cpu_count: number;
};

export type VsphereVmDetails = {
  instant_clone_frozen: boolean;
  cdroms: any;
  memory: {
    hot_add_increment_size_MiB: number;
    size_MiB: number;
    hot_add_enabled: boolean;
    hot_add_limit_MiB: number;
  };
  disks: {
    [key: string]: {
      scsi: {
        bus: number;
        unit: number;
      };
      backing: {
        vmdk_file: string;
        type: string;
      };
      label: string;
      type: string;
      capacity: number;
    };
  };
  cpu: {
    hot_remove_enabled: boolean;
    count: number;
    hot_add_enabled: boolean;
    cores_per_socket: number;
  };
  scsi_adapters: {
    [key: string]: {
      scsi: {
        bus: number;
        unit: number;
      };
      label: string;
      sharing: string;
      type: string;
    };
  };
  power_state: string;
  identity: {
    name: string;
    instance_uuid: string;
    bios_uuid: string;
  };
  name: string;
  nics: {
    [key: string]: {
      start_connected: boolean;
      pci_slot_number: number;
      upt_v2_compatibility_enabled: boolean;
      backing: {
        connection_cookie: number;
        distributed_port: string;
        distributed_switch_uuid: string;
        type: string;
        network: string;
      };
      mac_address: string;
      mac_type: string;
      allow_guest_control: boolean;
      wake_on_lan_enabled: boolean;
      label: string;
      state: string;
      type: string;
      upt_compatibility_enabled: boolean;
    };
  };
  boot: {
    delay: number;
    retry_delay: number;
    enter_setup_mode: boolean;
    type: string;
    retry: boolean;
  };
  guest_OS: string;
  hardware: {
    upgrade_policy: string;
    upgrade_status: string;
    version: string;
  };
};

export type VsphereVmNics = {
  [key: string]: {
    start_connected: boolean;
    pci_slot_number: number;
    upt_v2_compatibility_enabled: boolean;
    backing: {
      connection_cookie: number;
      distributed_port: string;
      distributed_switch_uuid: string;
      type: string;
      network: string;
    };
    mac_address: string;
    mac_type: string;
    allow_guest_control: boolean;
    wake_on_lan_enabled: boolean;
    label: string;
    state: string;
    type: string;
    upt_compatibility_enabled: boolean;
  };
};

export type VsphereHost = {
  host: string;
  name: string;
  connection_state: string;
  power_state: string;
};

export type VsphereNetwork = {
  name: string;
  type: string;
  network: string;
};

export type VsphereDatastore = {
  datastore: string;
  name: string;
  type: string;
  free_space: number;
  capacity: number;
};

export type VsphereDatastoreDetails = {
  accessible: boolean;
  multiple_host_access: boolean;
  name: string;
  type: string;
  free_space: number;
  thin_provisioning_supported: boolean;
};

export type VsphereDatacenter = {
  name: string;
  datacenter: string;
};

export type VsphereDatacenterDetails = {
  datastore_folder: string;
  host_folder: string;
  network_folder: string;
  name: string;
  vm_folder: string;
};

export type VsphereCluster = {
  drs_enabled: boolean;
  cluster: string;
  name: string;
  ha_enabled: boolean;
};

export type VsphereClusterDetails = {
  name: string;
  resource_pool: string;
};

export type VsphereNamespace = {
  control_plane_api_server_port: number;
  master_host: string;
  namespace: string;
};

export type VsphereDistributedSwitch = {
  compatible: boolean;
  incompatibility_reasons: string[];
  distributed_switch: string;
  network_provider: string;
};
