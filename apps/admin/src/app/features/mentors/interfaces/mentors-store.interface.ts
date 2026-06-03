import { IMentorProfile } from '@shared/models';

export interface MentorsStoreInterface {
  isLoading: boolean;
  isSaving: boolean;
  isSearchingUsers: boolean;
  userSearchTerm: string;
  searchedUsers: { email: string; name: string }[];
  mentors: [IMentorProfile[], number];
  mentor: IMentorProfile | null;
}
