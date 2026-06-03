import { IImage } from '@shared/models';

export interface ProjectGalleryStoreInterface {
  isLoading: boolean;
  gallery: IImage[];
}
