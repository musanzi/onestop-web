import { IUser } from '@shared/models';

export interface UsersStoreInterface {
  isLoading: boolean;
  isUpdating: boolean;
  isDownloading: boolean;
  isImportingCsv: boolean;
  users: [IUser[], number];
  user: IUser | null;
  staff: IUser[];
}
