import { IArticle, IImage } from '@shared/models';

export interface ArticlesStoreInterface {
  isLoading: boolean;
  articles: [IArticle[], number];
  article: IArticle | null;
  gallery: IImage[];
}
