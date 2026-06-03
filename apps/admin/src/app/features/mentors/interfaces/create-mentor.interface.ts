import { MentorType } from '../enums/mentor.enum';

export interface CreateExperienceInterface {
  id?: string;
  company_name: string;
  job_title: string;
  is_current: boolean;
  start_date: string;
  end_date?: string;
}

export interface MentorRequestInterface {
  years_experience: number;
  expertises: string[];
  type?: MentorType;
  experiences: CreateExperienceInterface[];
}

export interface CreateMentorInterface {
  email: string;
  mentor: MentorRequestInterface;
}
