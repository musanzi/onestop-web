import { CreateExperienceInterface } from './experience.interface';

export interface CreateMentorProfileInterface {
  years_experience: number;
  expertises: string[];
  experiences: CreateExperienceInterface[];
}
