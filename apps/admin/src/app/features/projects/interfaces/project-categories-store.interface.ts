import { ICategory } from '@shared/models';

export interface ProjectCategoriesStoreInterface {
  isLoading: boolean;
  categories: [ICategory[], number];
  allCategories: ICategory[];
}
