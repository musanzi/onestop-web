import { ISubprogram } from '@shared/models';

export interface SubprogramsStoreInterface {
  isLoading: boolean;
  subprograms: ISubprogram[];
}
