import { IExpertise } from '@shared/models';

export interface ExpertisesStoreInterface {
  isLoading: boolean;
  expertises: [IExpertise[], number];
  allExpertises: IExpertise[];
}
