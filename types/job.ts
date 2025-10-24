export type JobStatus =
  | 'interested'
  | 'preparing'
  | 'applied'
  | 'document_passed'
  | 'interview'
  | 'accepted'
  | 'rejected';

export type ExperienceLevel =
  | '신입'
  | '1-3년'
  | '3-5년'
  | '5년 이상'
  | '경력무관';

export type EmploymentType = '정규직' | '계약직' | '인턴';

export type JobCategory =
  | 'Backend'
  | 'Frontend'
  | 'Fullstack'
  | 'DevOps'
  | 'Data'
  | 'Mobile';

export interface JobTracking {
  id: string;
  user_id: string;
  url: string;
  company: string | null;
  position: string | null;
  experience: ExperienceLevel | null;
  employment_type: EmploymentType | null;
  keywords: string[];
  category: JobCategory | null;
  deadline: string | null; // ISO date string
  status: JobStatus;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateJobInput {
  url: string;
  company?: string;
  position?: string;
  experience?: ExperienceLevel;
  employment_type?: EmploymentType;
  keywords?: string[];
  category?: JobCategory;
  deadline?: string;
  status?: JobStatus;
  notes?: string;
}

export interface UpdateJobInput {
  company?: string;
  position?: string;
  experience?: ExperienceLevel;
  employment_type?: EmploymentType;
  keywords?: string[];
  category?: JobCategory;
  deadline?: string;
  status?: JobStatus;
  notes?: string;
  applied_at?: string;
}
