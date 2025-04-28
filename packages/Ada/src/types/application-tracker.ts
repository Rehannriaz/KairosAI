// app/types/application-tracker.ts
export interface ApplicationNote {
  id: string;
  application_id: string;
  note: string;
}

export interface Application {
  id: string;
  user_id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  updated_date: string;
  logo?: string | null;
  location?: string | null;
  salary?: string | null;
  next_step?: string | null;
  url?: string | null;
  application_tracker_notes?: ApplicationNote[];
}

export type ApplicationStatus =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Technical'
  | 'Offer'
  | 'Rejected'
  | 'Accepted'
  | 'Declined'
  | 'Withdrawn';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Screening',
  'Interview',
  'Technical',
  'Offer',
  'Rejected',
  'Accepted',
  'Declined',
  'Withdrawn',
];
