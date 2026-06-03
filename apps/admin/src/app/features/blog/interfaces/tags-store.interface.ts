import { ITag } from '@shared/models';
import { FilterArticlesTagsInterface } from './filter-tags.interface';

export interface TagsStoreInterface {
  isLoading: boolean;
  tags: [ITag[], number];
  allTags: ITag[];
  lastQuery: FilterArticlesTagsInterface | null;
}
