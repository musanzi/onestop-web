import { MentorStatus } from '../enums/mentor.enum';

export interface FilterMentorsProfileInterface {
  page: string | null;
  q: string | null;
  status: MentorStatus | null;
}
