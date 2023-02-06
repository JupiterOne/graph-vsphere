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

export type VsphereVmDetailsDeprecated = {
  boot: {
    delay: number;
    efi_legacy_boot: boolean;
    enter_setup_mode: boolean;
    network_protocol: string;
    retry: boolean;
    retry_delay: number;
    type: string;
  };
  boot_devices: [
    {
      disks: [string];
      nic: string;
      type: string;
    },
  ];
  cdroms: [
    {
      key: string;
      value: {
        allow_guest_control: boolean;
        backing: {
          auto_detect: boolean;
          device_access_type: string;
          host_device: string;
          iso_file: string;
          type: string;
        };
        ide: {
          master: boolean;
          primary: boolean;
        };
        label: string;
        sata: {
          bus: number;
          unit: number;
        };
        start_connected: boolean;
        state: string;
        type: string;
      };
    },
  ];
  cpu: {
    cores_per_socket: number;
    count: number;
    hot_add_enabled: boolean;
    hot_remove_enabled: boolean;
  };
  disks: [
    {
      key: string;
      value: {
        backing: {
          type: string;
          vmdk_file: string;
        };
        capacity: number;
        ide: {
          master: boolean;
          primary: boolean;
        };
        label: string;
        sata: {
          bus: number;
          unit: number;
        };
        scsi: {
          bus: number;
          unit: number;
        };
        type: string;
      };
    },
  ];
  floppies: [
    {
      key: string;
      value: {
        allow_guest_control: boolean;
        backing: {
          auto_detect: boolean;
          host_device: string;
          image_file: string;
          type: string;
        };
        label: string;
        start_connected: boolean;
        state: string;
      };
    },
  ];
  guest_OS: string;
  hardware: {
    upgrade_error: {};
    upgrade_policy: string;
    upgrade_status: string;
    upgrade_version: string;
    version: string;
  };
  identity: {
    bios_uuid: string;
    instance_uuid: string;
    name: string;
  };
  instant_clone_frozen: boolean;
  memory: {
    hot_add_enabled: boolean;
    hot_add_increment_size_MiB: number;
    hot_add_limit_MiB: number;
    size_MiB: number;
  };
  name: string;
  nics: [
    {
      key: string;
      value: {
        allow_guest_control: boolean;
        backing: {
          connection_cookie: number;
          distributed_port: string;
          distributed_switch_uuid: string;
          host_device: string;
          network: string;
          network_name: string;
          opaque_network_id: string;
          opaque_network_type: string;
          type: string;
        };
        label: string;
        mac_address: string;
        mac_type: string;
        pci_slot_number: number;
        start_connected: boolean;
        state: string;
        type: string;
        upt_compatibility_enabled: boolean;
        wake_on_lan_enabled: boolean;
      };
    },
  ];
  parallel_ports: [
    {
      key: string;
      value: {
        allow_guest_control: boolean;
        backing: {
          auto_detect: boolean;
          file: string;
          host_device: string;
          type: string;
        };
        label: string;
        start_connected: boolean;
        state: string;
      };
    },
  ];
  power_state: string;
  sata_adapters: [
    {
      key: string;
      value: {
        bus: number;
        label: string;
        pci_slot_number: number;
        type: string;
      };
    },
  ];
  scsi_adapters: [
    {
      key: string;
      value: {
        label: string;
        pci_slot_number: number;
        scsi: {
          bus: number;
          unit: number;
        };
        sharing: string;
        type: string;
      };
    },
  ];
  serial_ports: [
    {
      key: string;
      value: {
        allow_guest_control: boolean;
        backing: {
          auto_detect: boolean;
          file: string;
          host_device: string;
          network_location: string;
          no_rx_loss: boolean;
          pipe: string;
          proxy: string;
          type: string;
        };
        label: string;
        start_connected: boolean;
        state: string;
        yield_on_poll: boolean;
      };
    },
  ];
};

export type VsphereGuestInfo = {
  family: string;
  full_name: {
    args: [string];
    default_message: string;
    id: string;
    localized: string;
    params: {
      key: {
        d: number;
        dt: string;
        format: string;
        i: number;
        l: {
          id: string;
          params: object;
        };
        precision: number;
        s: string;
      };
    };
  };
  host_name: string;
  ip_address: string;
  name: string;
};

// This deprecated form is technically wrapped in a value: {} object, but
// we have a better time of supporting it if we define the type as not having
// that and manually fix it in the client.
export type VsphereGuestInfoDeprecated = {
  family: string;
  full_name: {
    args: [string];
    default_message: string;
    id: string;
    localized: string;
    params: [
      {
        key: string;
        value: {
          d: number;
          dt: string;
          format: string;
          i: number;
          l: {
            id: string;
            params: string;
          };
          precision: number;
          s: string;
        };
      },
    ];
  };
  host_name: string;
  ip_address: string;
  name: string;
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

export type VsphereVersion = {
  value: {
    summary: string;
    install_time: string;
    product: string;
    build: string;
    releasedate: string;
    type: string;
    version: string;
  };
};
