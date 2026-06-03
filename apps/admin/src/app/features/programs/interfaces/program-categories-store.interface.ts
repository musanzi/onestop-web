import { ICategory } from '@shared/models';

export interface ProgramCategoriesStoreInterface {
  isLoading: boolean;
  categories: [ICategory[], number];
  allCategories: ICategory[];
}
