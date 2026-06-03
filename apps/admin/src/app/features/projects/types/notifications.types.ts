import { INotification, IProject } from '@shared/models';
import { NotifyParticipantsInterface } from '../interfaces/notify-participants.interface';
import { SelectOption } from '@shared/ui/form';

export enum NotificationStatus {
  DRAFT = 'draft',
  SENT = 'sent'
}

export interface SubmitNotification {
  dto: NotifyParticipantsInterface;
  attachments: File[];
}

export interface NotificationState {
  activeNotification: INotification | null;
  phaseOptions: SelectOption[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isEditable: boolean;
  project: IProject;
}

export interface NotificationsState {
  notifications: INotification[];
  total: number;
  activeNotificationId: string | null;
  currentPage: number;
  itemsPerPage: number;
}
