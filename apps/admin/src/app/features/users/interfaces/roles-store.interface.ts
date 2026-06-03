import { IRole } from '@shared/models';

export interface RolesStoreInterface {
  isLoading: boolean;
  roles: [IRole[], number];
  allRoles: IRole[];
}
