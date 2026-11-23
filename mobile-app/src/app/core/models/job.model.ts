export interface UserResponse {
  id: number;
  email: string;
  name: string;
  telegramChatId?: string;
  createdAt?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface SearchProfile {
  id?: number;
  name: string;
  keywords: string;
  min_score: number;
  created_at?: string;
}

export interface JobResponse {
  id: number;
  job_hash?: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  source?: string;
  posted_at?: string;
  created_at?: string;
}

export type MatchStatus = 'new' | 'applied' | 'interview' | 'discarded' | 'viewed' | 'rejected' | 'NEW' | 'APPLIED' | 'INTERVIEW' | 'DISCARDED';

export interface UserJobMatchResponse {
  id: number;
  user_id?: number;
  job_id: number;
  score: number;
  is_notified_telegram?: boolean;
  is_favorite: boolean;
  status: MatchStatus;
  matched_at?: string;
  job: JobResponse;
}

export interface Skill {
  name: string;
  category: string;
}

export interface JobFilter {
  status?: string;
  is_favorite?: boolean;
  min_score?: number;
  search?: string;
}
