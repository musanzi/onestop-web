import { IProjectParticipation } from '@shared/models';

export interface ParticipationsStoreInterface {
  isLoading: boolean;
  isDetailLoading: boolean;
  isSaving: boolean;
  participations: IProjectParticipation[];
  total: number;
  participation: IProjectParticipation | null;
  error: string | null;
}
