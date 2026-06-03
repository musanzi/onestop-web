import { IMentorProfile, IPhase } from '@shared/models';

export interface IPhasesStoreInterface {
  isLoading: boolean;
  isMentorsLoading: boolean;
  phases: IPhase[];
  phase: IPhase | null;
  mentors: IMentorProfile[];
}
