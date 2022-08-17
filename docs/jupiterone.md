# VMware vSphere Integration with JupiterOne

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

- JupiterOne requires a vSphere vCenter username and password. You need to have
  VMware vSphere configured.
- You must have permission in JupiterOne to install new integrations.

## Firewall

It will probably be necessary to whitelist JupiterOne servers in your VMware
vSphere. To do that you'll need to navigate to VMware Cloud > Inventory and
select your SDDC. Next, you should navigate to the "Networking & Security" tab
and assign JupiterOne static IPs to the new management group (Inventory >
Groups). After doing that, you'll need to go to the "Gateway Firewall" section,
select the "Management Gateway" tab and create the following new rule:

Source: `[created group]` Destinations: `vCenter` Services: `HTTPS` Action:
`Allow`

After publishing this rule, the JupiterOne servers will be able to allowed to
interact with your vSphere SDDC and run the integration.

The list of JupiterOne static IPs can be
[found here](https://jupiterone.atlassian.net/wiki/spaces/INT/pages/37618044/Public+IPs+for+Integrations+outbound+traffic+enabling+on-premise+support).

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

### In VMware vSphere

1. Have SDDC set up in VMware inventory.
2. Make sure you're able to access SDDC's vCenter.
3. Note down the vCenter credentials (login and password).
4. Note down the vCenter path in the vSphere Client
   (vcenter.sddc-X-YY-ZZ-F.vmwarevmc.com).

### In JupiterOne

1. From the configuration **Gear Icon**, select **Integrations**.
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

1. From the configuration **Gear Icon**, select **Integrations**.
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
