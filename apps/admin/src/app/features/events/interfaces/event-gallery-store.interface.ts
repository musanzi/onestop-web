import { IImage } from '@shared/models';

export interface GalleryStoreInterface {
  isLoading: boolean;
  gallery: IImage[];
}
