import { IEvent } from '@shared/models';

export interface EventsStoreInterface {
  isLoading: boolean;
  events: [IEvent[], number];
  event: IEvent | null;
}
