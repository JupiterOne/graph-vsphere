# Development

This integration focuses on VMware vSphere and is using
[vCenter REST APIs](https://developer.vmware.com/apis/vsphere-automation/latest/vcenter/)
for interacting with the VMware vSphere vCenter.

## Prerequisites

Active SDDC in VMware vSphere is required.

## Firewall

It will probably be necessary to whitelist JupiterOne servers in your VMware
vSphere. To do that you'll need to do the following:

- Launch the VMware Cloud service
- Navigate to "Inventory" on the left
- Open vCenter on your SDDC and select "Firewall rules"
- Click "Edit gateway firewall rules" under Default Compute Gateway
- Click "Access via the internet"
- Under the "Security" tab click "Gateway Firewall" on the left
- Select the "Management Gateway" tab
- Click "+ Add Rule"
- For Source, check the "User defined groups" radio button
- Click "Add Group"
- Name the group then click "Set" under the Compute Members column
- Paste the JupiterOne static IP addresses in the text box that appears and
  click "Apply"
- Check your newly created group and click "Apply"
- Set the remaining fields as shown:

```
Source: `[created group]` Destinations: `vCenter` Services: `HTTPS` Action:
`Allow`
```

- Click publish

After publishing this rule, the JupiterOne servers will be able to allowed to
interact with your vSphere SDDC and run the integration.

The list of JupiterOne static IPs can be
[found here](https://jupiterone.atlassian.net/wiki/spaces/INT/pages/37618044/Public+IPs+for+Integrations+outbound+traffic+enabling+on-premise+support).

## Provider account setup

1. Have SDDC set up in VMware inventory.
2. Make sure you're able to access SDDC's vCenter.
3. Note down the vCenter credentials (login and password).
4. Note down the vCenter domain in the vSphere Client
   (vcenter.sddc-X-YY-ZZ-F.vmwarevmc.com).

## Authentication

Provide the vCenter login as LOGIN, vCenter password as PASSWORD, and the
vCenter domain (step 4 above) as DOMAIN in the `.env`. You can use
[.env.example](../.env.example) as reference.

## Developing while using HAR recordings

Because creating SDDC isn't super simple, we've included har-server dependency
which allows us to re-use stored HAR recordings and run the integration
(locally, during the development) against them.

1. serve:har - Starts the har-server
2. start:har - Runs the integration against har-server
3. serve:har:error - Starts har-server but serves errors
4. test:env-har - Runs tests against har server

## Bundling Dependencies for Published Docker Image

This integration is published to Jupiterone's DockerHub whenever we release a
package update. This image must be able to be run standalone and cannot rely on
peerDependencies being present at runtime. Therefore, a slightly different
`package.json` file is required that includes the necessary dependencies that
remain peerDependencies or devDependencies for the project proper. This file is
called `docker.package.json`. Prior to bumping our `package.json` version, we
should bump `docker.package.json`. We should also keep depencencies on identical
versions (e.g ` "@jupiterone/integration-sdk-core": "^8.8.0"`). See the
`Dockerfile` in project root to gain an understanding on how we use this file to
install our dependencies for our docker image.
