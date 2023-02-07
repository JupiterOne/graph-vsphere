import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  StepStartStates,
  DisabledStepReason,
} from '@jupiterone/integration-sdk-core';
import { APIVersion, getOrCreateAPIClient } from './client';
import { Steps } from './steps/constants';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  domain: {
    type: 'string',
  },
  login: {
    type: 'string',
  },
  password: {
    type: 'string',
    mask: true,
  },
  disableTlsVerification: {
    type: 'boolean',
    optional: true,
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The provider domain used for requests.
   *
   */
  domain: string;

  /**
   * The provider account login used to get session token.
   */
  login: string;

  /**
   * The provider account password used to get session token.
   */
  password: string;

  /**
   * Disable TLS certificate verification for hosts that cannot install certificates.
   */
  disableTlsVerification?: boolean;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.domain || !config.login || !config.password) {
    throw new IntegrationValidationError(
      'Config requires all of {domain, login, password}',
    );
  }

  if (config.disableTlsVerification) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    context.logger.warn(
      `Disabling TLS certificate verification based on .env.  If possible, please install valid TLS certificates into vSphere server.`,
    );
    context.logger.publishEvent({
      name: 'disable_tls_verify',
      description:
        'Disabling TLS certificate verification. NOT RECOMMENDED: If possible, please install valid TLS certificates into vSphere server.',
    });
  }

  const apiClient = getOrCreateAPIClient(config, context.logger);
  await apiClient.verifyAuthentication();
}

export async function getStepStartStates(
  executionContext: IntegrationExecutionContext<IntegrationConfig>,
): Promise<StepStartStates> {
  // Check for version 7.0.0 or greater and disable two steps if not
  const { config } = executionContext.instance;
  const apiClient = getOrCreateAPIClient(config, executionContext.logger);

  const version: APIVersion = await apiClient.getVersion();

  const supportedVersionCheck: boolean = version.major < 7;

  return {
    [Steps.ACCOUNT]: { disabled: false },
    [Steps.BUILD_VM_NETWORK]: { disabled: false },
    [Steps.CLUSTER]: { disabled: false },
    [Steps.DATASTORE]: { disabled: false },
    [Steps.DATA_CENTER]: { disabled: false },
    [Steps.DISTRIBUTED_SWITCH]: {
      disabled: supportedVersionCheck,
      disabledReason: DisabledStepReason.CONFIG,
    },
    [Steps.HOST]: { disabled: false },
    [Steps.NAMESPACE]: {
      disabled: supportedVersionCheck,
      disabledReason: DisabledStepReason.CONFIG,
    },
    [Steps.NETWORK]: { disabled: false },
    [Steps.VM]: { disabled: false },
  };
}
