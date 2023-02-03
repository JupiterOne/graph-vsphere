import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { integrationSteps } from './steps';
import {
  validateInvocation,
  IntegrationConfig,
  instanceConfigFields,
  getStepStartStates,
} from './config';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> =
  {
    instanceConfigFields,
    getStepStartStates,
    validateInvocation,
    integrationSteps,
  };
