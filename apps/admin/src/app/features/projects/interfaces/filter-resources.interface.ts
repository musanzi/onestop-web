import { ResourceCategory } from '@shared/models';

export interface FilterResourcesInterface {
  page?: number | null;
  category?: ResourceCategory | null;
  phase_id?: string | null;
}
