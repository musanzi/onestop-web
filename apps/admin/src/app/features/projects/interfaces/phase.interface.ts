export interface DeliverableInterface {
  title: string;
  description?: string;
}

export interface PhaseInterface {
  id?: string;
  name: string;
  description: string;
  started_at: Date;
  ended_at: Date;
  mentors?: string[];
  deliverables?: DeliverableInterface[];
}
