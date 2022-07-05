# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Ingest new entities
  - `vsphere_client`
  - `vsphere_cluster`
  - `vsphere_data_center`
  - `vsphere_datastore`
  - `vsphere_distributed_switch`
  - `vsphere_host`
  - `vsphere_namespace`
  - `vsphere_network`
  - `vsphere_vm`
- Build new relationships
  - `vsphere_client_manages_data_center`
  - `vsphere_cluster_uses_distributed_switch`
  - `vsphere_vm_uses_network`
