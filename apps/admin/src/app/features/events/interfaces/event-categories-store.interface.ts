import { ICategory } from '@shared/models';

export interface CategoriesStoreInterface {
  isLoading: boolean;
  categories: [ICategory[], number];
  allCategories: ICategory[];
}
