import { accountSteps } from './account';
import { clusterSteps } from './cluster';
import { datacenterSteps } from './data-center';
import { datastoreSteps } from './datastore';
import { distributedSwitchSteps } from './distributed-switch';
import { hostSteps } from './host';
import { namespaceSteps } from './namespace';
import { networkSteps } from './network';
import { vmSteps } from './virtual-machine';

const integrationSteps = [
  ...accountSteps,
  ...datacenterSteps,
  ...clusterSteps,
  ...hostSteps,
  ...vmSteps,
  ...datastoreSteps,
  ...networkSteps,
  ...distributedSwitchSteps,
  ...namespaceSteps,
];

export { integrationSteps };
