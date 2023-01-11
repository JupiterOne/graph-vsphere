import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

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
    context.logger.warn(`Disabling TLS certificate verification based on .env`);
    context.logger.publishEvent({
      name: 'disable_tls_verify',
      description:
        'Disabling TLS certificate verification. NOT RECOMMENDED: If possible, please install valid TLS certificates into vSphere server.',
    });
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
