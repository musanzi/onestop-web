import type { IGeneralStats, IStatsByYear } from '../types/stats.type';

export interface StatsStoreInterface {
  isLoadingGeneral: boolean;
  isLoadingByYear: boolean;
  general: IGeneralStats | null;
  byYear: IStatsByYear | null;
  selectedYear: number;
}
