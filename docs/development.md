# Development

This integration focuses on VMware vSphere and is using
[vCenter REST APIs](https://developer.vmware.com/apis/vsphere-automation/latest/vcenter/)
for interacting with the VMware vSphere vCenter.

## Prerequisites

Active SDDC in VMware vSphere is required.

## Provider account setup

1. Have SDDC set up in VMware inventory.
2. Make sure you're able to access SDDC's vCenter.
3. Note down the vCenter credentials (login and password).
4. Note down the vCenter path in the vSphere Client
   (vcenter.sddc-X-YY-ZZ-F.vmwarevmc.com).

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

## Authentication

Provide the vCenter login as LOGIN, vCenter password as PASSWORD, and the
vCenter path (step 4 above) as DOMAIN in the `.env`. You can use
[.env.example](../.env.example) as reference.

## Developing while using HAR recordings

Because creating SDDC isn't super simple, we've included har-server dependency
which allows us to re-use stored HAR recordings and run the integration
(locally, during the development) against them.

1. serve:har - Starts the har-server
2. start:har - Runs the integration against har-server
3. serve:har:error - Starts har-server but serves errors
4. test:env-har - Runs tests against har server
