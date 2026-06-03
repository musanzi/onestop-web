import { ResourceCategory } from '@shared/models';

export interface CreateResourceInterface {
  title: string;
  description: string;
  category: ResourceCategory;
  project_id?: string;
  phase_id?: string;
}

export interface UpdateResourceInterface {
  title?: string;
  description?: string;
  category?: ResourceCategory;
}
