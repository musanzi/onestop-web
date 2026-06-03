import { IOpportunity } from '@shared/models';

export interface OpportunitiesStoreInterface {
  isLoading: boolean;
  opportunities: IOpportunity[];
  opportunity: IOpportunity | null;
}
