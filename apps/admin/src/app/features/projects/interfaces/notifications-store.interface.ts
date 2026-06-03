import { INotification } from '@shared/models';

export interface NotificationsStoreInterface {
  isLoading: boolean;
  isSaving: boolean;
  notifications: [INotification[], number];
  activeNotification: INotification | null;
  error: string | null;
}
