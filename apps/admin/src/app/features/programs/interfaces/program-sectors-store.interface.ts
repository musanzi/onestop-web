import { ISector } from '@shared/models';

export interface ProgramSectorsStoreInterface {
  isLoading: boolean;
  sectors: ISector[];
}
