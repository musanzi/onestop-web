import { IVenture } from '@shared/models';

export interface VenturesStoreInterface {
  isLoading: boolean;
  ventures: [IVenture[], number];
  venture: IVenture | null;
}
