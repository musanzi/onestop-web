import { Program } from '@shared/models';

export interface IProgramsStoreInterface {
  isLoading: boolean;
  programs: [Program[], number];
  program: Program | null;
  allPrograms: Program[];
}
