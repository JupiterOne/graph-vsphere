import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { clusterSpec } from './cluster';
import { dataCenterSpec } from './data-center';
import { datastoreSpec } from './datastore';
import { distributedSwitchSpec } from './distributed-switch';
import { hostSpec } from './host';
import { namespaceSpec } from './namespace';
import { networkSpec } from './network';
import { virtualMachineSpec } from './virtual-machine';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...clusterSpec,
    ...dataCenterSpec,
    ...datastoreSpec,
    ...distributedSwitchSpec,
    ...hostSpec,
    ...namespaceSpec,
    ...networkSpec,
    ...virtualMachineSpec,
  ],
};
