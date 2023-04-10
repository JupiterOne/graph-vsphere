# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.5.3 - 2023-04-10

### Changed

- New event to see the version

## [Unreleased]

## 1.5.2 - 2023-04-05

### Changed

- Properties for vsphere_vm entities have been updated to include the SMBIOS
  UUID

## 1.5.1 - 2023-03-13

### Changed

- Queries to list VMs per host are now wrapped in a try catch to avoid one
  failed host canceling the remainder of the data collection for that step.

## 1.5.0 - 2023-02-14

### Added

- Backwards compatiblity for supported steps now exists back to version 6.5.

### Changed

- VM queries are now done on a host by host basis to reduce API query size.

## 1.4.0 - 2023-02-02

### Changed

- The vSphere client is now initialized as a singleton.
- An API version query is now a required step of initialization to be able to
  better support multiple releases of vSphere.

## 1.3.0 - 2023-01-24

### Changed

- Values for hostname and IP address are now included for vsphere_vm entities
  when available.

## 1.2.0 - 2023-01-11

### Changed

- Properties for vsphere_host entities have been updated to match the current
  data-model schema.
- Duplicate vsphere_vm-USES->vsphere_network relationships are now prevented.

## 1.1.0 - 2022-12-12

### Changed

- The config value `domain` must now include the full domain. Previously,
  `.vmwarevmc.com` was appended to the supplied domain requiring only
  `vcenter.sddc-X-YY-ZZ-F`. The following is a correct example of a domain:
  `vcenter.sddc-X-YY-ZZ-F.vmwarevmc.com`.

## 1.0.3 - 2022-11-18

### Changed

- fix Dockerfile to include necessary sdk deps to run integration on-prem
- update docs
- added `docker.env.example` file
- added `docker.package.json`. This MUST be updated alongside our normal
  `package.json`

## 1.0.2 - 2022-10-21

### Changed

- update docs
- docker image will collect+sync instead of just collect

## 1.0.1 - 2022-10-21

### Added

- publish docker image of this project to Docker Hub

## 1.0.0 - 2022-08-09

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
