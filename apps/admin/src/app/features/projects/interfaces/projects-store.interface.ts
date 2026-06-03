import { IProject } from '@shared/models';

export interface ProjectsStoreInterface {
  isLoading: boolean;
  isImportingCsv: boolean;
  projects: [IProject[], number];
  project: IProject | null;
}
