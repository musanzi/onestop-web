import type { OpportunityLanguage } from '@shared/models';

export interface FilterOpportunitiesInterface {
  from: string | null;
  to: string | null;
  language: OpportunityLanguage | null;
}
