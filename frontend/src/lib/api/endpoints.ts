import { apiClient } from "./client";
import type {
  AuthResponse,
  GitHubCommit,
  GitHubRepository,
  GeneratePostRequest,
  GeneratePostResponse,
  Idea,
  IdeaCategory,
  Integration,
  OnboardingData,
  Post,
  User,
} from "@/lib/types";

// ─── Auth ───────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", { name, email, password });
  return data;
}

// ─── Users ──────────────────────────────────────────────────────────────────
export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: Partial<User & OnboardingData>): Promise<User> {
  const { data } = await apiClient.patch<User>("/users/me", payload);
  return data;
}

export async function completeOnboarding(payload: OnboardingData): Promise<User> {
  const { data } = await apiClient.patch<User>("/users/me", {
    ...payload,
    onboarding_completed: true,
  });
  return data;
}

export async function getDailyIdeas(): Promise<Idea[]> {
  const { data } = await apiClient.get<Idea[]>("/ai/ideas/daily");
  return data;
}

// ─── Posts ──────────────────────────────────────────────────────────────────
export async function getPosts(params?: { status?: string; limit?: number }): Promise<Post[]> {
  const { data } = await apiClient.get<Post[]>("/posts", { params });
  return data;
}

export async function getPost(id: string): Promise<Post> {
  const { data } = await apiClient.get<Post>(`/posts/${id}`);
  return data;
}

export async function createPost(payload: Partial<Post>): Promise<Post> {
  const { data } = await apiClient.post<Post>("/posts", payload);
  return data;
}

export async function updatePost(id: string, payload: Partial<Post>): Promise<Post> {
  const { data } = await apiClient.patch<Post>(`/posts/${id}`, payload);
  return data;
}

export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`/posts/${id}`);
}

// ─── AI ─────────────────────────────────────────────────────────────────────
export async function generatePost(payload: GeneratePostRequest): Promise<GeneratePostResponse> {
  const { data } = await apiClient.post<GeneratePostResponse>("/ai/generate", payload);
  return data;
}

export async function improvePost(content: string, instruction: string): Promise<{ content: string }> {
  const { data } = await apiClient.post<{ content: string }>("/ai/improve", { content, instruction });
  return data;
}

export async function getIdeas(category?: IdeaCategory): Promise<Idea[]> {
  const { data } = await apiClient.post<Idea[]>("/ai/ideas", { category });
  return data;
}

// ─── Integrations ───────────────────────────────────────────────────────────
export async function getIntegrations(): Promise<Integration[]> {
  const { data } = await apiClient.get<Integration[]>("/integrations");
  return data;
}

export async function connectGitHub(): Promise<void> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  window.location.href = token
    ? `${apiClient.defaults.baseURL}/github/connect?token=${encodeURIComponent(token)}`
    : "/login";
}

export async function getGitHubRepos(): Promise<GitHubRepository[]> {
  const { data } = await apiClient.get<GitHubRepository[]>("/github/repositories");
  return data;
}

export async function getGitHubCommits(repository: string): Promise<GitHubCommit[]> {
  const { data } = await apiClient.get<GitHubCommit[]>(`/github/repositories/${encodeURIComponent(repository)}/commits`);
  return data;
}
