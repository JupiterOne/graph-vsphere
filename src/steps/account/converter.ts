import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createAccountEntity(account: { domain: string }): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: 'vsphere_account',
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: account.domain,
      },
    },
  });
}
