export interface CreateParticipationReviewInterface {
  phaseId: string;
  score: number;
  message?: string;
  notifyParticipant?: boolean;
}

export interface UpdateParticipationReviewInterface {
  reviewId: string;
  score: number;
  message?: string;
  notifyParticipant?: boolean;
}

export type ReviewParticipationInterface = CreateParticipationReviewInterface | UpdateParticipationReviewInterface;
