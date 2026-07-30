export type PostStatus = "draft" | "scheduled" | "published";
export type PostTone = "professional" | "casual" | "technical" | "inspirational" | "storytelling";
export type PostLength = "short" | "medium" | "long";
export type PostType = "story" | "tip" | "tutorial" | "opinion" | "achievement" | "question";
export type IdeaCategory =
  | "backend"
  | "frontend"
  | "ai"
  | "productivity"
  | "career"
  | "mistakes"
  | "learnings"
  | "opinions"
  | "tutorials";

export type UserGoal = "job" | "personal_brand" | "clients" | "networking";
export type PublishFrequency = "daily" | "3x_week" | "weekly" | "biweekly";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  profession?: string;
  technologies?: string[];
  goal?: UserGoal;
  tone?: PostTone;
  language?: string;
  publish_frequency?: PublishFrequency;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  status: PostStatus;
  scheduled_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  tone?: PostTone;
  post_type?: PostType;
  source?: string;
  impressions?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[];
  is_saved: boolean;
  created_at: string;
}

export interface GeneratePostRequest {
  mode: "idea" | "project" | "github" | "url" | "free_text" | "conversation" | "experience";
  source_content?: string;
  repository_id?: string;
  url?: string;
  tone: PostTone;
  length: PostLength;
  emoji_count: number;
  post_type: PostType;
  call_to_action?: string;
}

export interface GeneratePostResponse {
  id: string;
  content: string;
  suggestions?: string[];
}

export interface OnboardingData {
  profession: string;
  technologies: string[];
  goal: UserGoal;
  tone: PostTone;
  language: string;
  publish_frequency: PublishFrequency;
}

export interface Integration {
  provider: "github";
  connected: boolean;
  username?: string;
  connected_at?: string;
}

export interface GitHubRepository {
  id: string;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  language: string;
  html_url: string;
  updated_at: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  html_url: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface ApiError {
  detail: string;
  code?: string;
  errors?: Record<string, string[]>;
}
