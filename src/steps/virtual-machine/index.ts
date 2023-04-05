import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';

import { getOrCreateAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  VsphereGuestInfo,
  VsphereGuestInfoDeprecated,
  VsphereVmDetails,
  VsphereVmDetailsDeprecated,
} from '../../types';
import { Steps, Entities } from '../constants';
import { createVmEntity } from './converter';

export async function fetchVms({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = getOrCreateAPIClient(instance.config, logger);
  let guestQueryFailCount: number = 0;
  let guestQuerySuccessCount: number = 0;
  let vmGuest: VsphereGuestInfo | VsphereGuestInfoDeprecated | null;
  let vmDetails: VsphereVmDetails | VsphereVmDetailsDeprecated | null;
  let bios_uuid: string;
  let detailsQueryFailCount: number = 0;
  let detailsQuerySuccessCount: number = 0;

  await jobState.iterateEntities(
    { _type: Entities.HOST._type },
    async (hostEntity) => {
      logger.info(`Querying VMs for host `, hostEntity.hostname);
      await apiClient.iterateVms(async (vm) => {
        // Wrap the VM Guest call in a try block, since it may give a 503 error
        // if we don't have VMware tools enabled on some VMs.
        try {
          vmGuest = await apiClient.getVmGuest(vm.vm as string);
          guestQuerySuccessCount++;
        } catch (err) {
          logger.info(
            `Unable to query vcenter/vm/${vm.vm}/guest/identity endpoint.  This may be due to permissions or having VMware tools turned off on that VM.`,
          );
          vmGuest = null;
          guestQueryFailCount++;
        }
        try {
          vmDetails = await apiClient.getVm(vm.vm as string);
          bios_uuid = vmDetails.identity?.bios_uuid;
          detailsQuerySuccessCount++;
        } catch (err) {
          logger.info(`Unable to query vcenter/vm/${vm.vm} endpoint.`);
          vmDetails = null;
          detailsQueryFailCount++;
        }
        await jobState.addEntity(createVmEntity(vm, vmGuest, bios_uuid));
      }, hostEntity.hostname as string);
    },
  );

  if (guestQueryFailCount > 0) {
    logger.publishWarnEvent({
      name: IntegrationWarnEventName.MissingPermission,
      description: `Could not query all guest information for VMs.  This may be due to permissions or having VMware tools turned off on those VMs.  Success = ${guestQuerySuccessCount}  Failed = ${guestQueryFailCount}`,
    });
  }
  if (detailsQueryFailCount > 0) {
    logger.publishWarnEvent({
      name: IntegrationWarnEventName.MissingPermission,
      description: `Could not query all configuration states for VMs.  This may be due to permissions.  Success = ${detailsQuerySuccessCount}  Failed = ${detailsQueryFailCount}`,
    });
  }
}

export const vmSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.VM,
    name: 'Fetch Virtual Machine',
    entities: [Entities.VIRTUAL_MACHINE],
    relationships: [],
    dependsOn: [Steps.HOST],
    executionHandler: fetchVms,
  },
];
