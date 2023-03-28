# VMware vSphere

## VMware vSphere + JupiterOne Integration Benefits

- Visualize VMware vSphere data centers, clusters, hosts and more in the
  JupiterOne graph.
- Monitor changes to VMware vSphere resources using JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches data centers, clusters, hosts and more from
  VMware vSphere to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when JupiterOne graph changes, or leverage
  existing alerts.

## Requirements

- JupiterOne requires the username and password for an account configured to
  access VMware vSphere. The integration will attempt to run all steps and will
  complete as many as possible based on the account's access. It is recommended
  that the account is provided with global readonly permissions to all inventory
  hierarchies.
- You must have permission in JupiterOne to install new integrations.
- This integration currently supports vSphere versions 6.5 - 8.0 with the
  following steps only available in certain versions:

  #### Namespace Ingestion

  - Only supported on versions 7.0.0 and newer

  #### Distributed Switch Ingestion

  - Only supported on versions 7.0.0 and newer

  #### VM Guest Identity

  - Only supported on versions 6.7.0 and newer

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Docker Walkthrough

This integration also has an image published on
[Docker Hub](https://hub.docker.com/r/jupiterone/graph-vsphere). It will perform
a
[j1-integration run](https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md#command-j1-integration-run)
command when ran. When running, you must set the following environment
variables:

- JUPITERONE_API_KEY: api-key for integration instance you would like to sync
  with
- JUPITERONE_ACCOUNT_ID: account id
- INTEGRATION_INSTANCE_ID: id of the integration instance you would like to sync
  with
- DOMAIN: your vCenter path in the vSphere Client
- LOGIN: login for vSphere
- PASSWORD: password for vSphere

This can be added as an environment file (e.g `docker.env`) and passed using the
`--env-file` option when performing the `docker run` command.

## Integration Walkthrough

### In VMware vSphere

1. Have SDDC set up in VMware inventory.
2. Make sure you're able to access SDDC's vCenter.
3. Note down the vCenter credentials (login and password).
4. Note down the vCenter path in the vSphere Client
   (vcenter.sddc-X-YY-ZZ-F.vmwarevmc.com).

### In JupiterOne

1. From the top navigation of the J1 Search homepage, select **Integrations**.
2. Scroll to the **VMware vSphere** integration tile and click it.
3. Click the **Add Configuration** button and configure the following settings:

- Enter the **Account Name** by which you'd like to identify this VMware vSphere
  account in JupiterOne. Ingested entities will have this value stored in
  `tag.AccountName` when **Tag with Account Name** is checked.
- Enter a **Description** that will further assist your team when identifying
  the integration instance.
- Select a **Polling Interval** that you feel is sufficient for your monitoring
  needs. You may leave this as `DISABLED` and manually execute the integration.
- Enter the **VMware vSphere** domain, login and password generated for use by
  JupiterOne.

4. Click **Create Configuration** once all values are provided.

# How to Uninstall

1. From the top navigation of the J1 Search homepage, select **Integrations**.
2. Scroll to the **VMware vSphere** integration tile and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources          | Entity `_type`               | Entity `_class` |
| ------------------ | ---------------------------- | --------------- |
| Account            | `vsphere_client`             | `Application`   |
| Cluster            | `vsphere_cluster`            | `Cluster`       |
| Data Center        | `vsphere_data_center`        | `Group`         |
| Datastore          | `vsphere_datastore`          | `DataStore`     |
| Distributed Switch | `vsphere_distributed_switch` | `Configuration` |
| Host               | `vsphere_host`               | `Host`          |
| Namespace          | `vsphere_namespace`          | `Group`         |
| Network            | `vsphere_network`            | `Network`       |
| Virtual Machine    | `vsphere_vm`                 | `Workload`      |

### Relationships

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type`        |
| --------------------- | --------------------- | ---------------------------- |
| `vsphere_client`      | **MANAGES**           | `vsphere_data_center`        |
| `vsphere_cluster`     | **USES**              | `vsphere_distributed_switch` |
| `vsphere_vm`          | **USES**              | `vsphere_network`            |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
