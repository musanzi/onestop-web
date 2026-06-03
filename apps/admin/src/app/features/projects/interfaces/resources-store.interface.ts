import { IResource } from '@shared/models';

export interface ResourcesStoreInterface {
  isLoading: boolean;
  isSaving: boolean;
  resources: [IResource[], number];
}
