import axios, { type AxiosError } from "axios";
import type { ApiError } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh });
          localStorage.setItem("access_token", data.access);
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${data.access}`;
            return apiClient.request(error.config);
          }
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const fieldErrors = data?.errors;
    if (fieldErrors && typeof fieldErrors === "object") {
      const firstError = Object.values(fieldErrors).flat().find((value) => typeof value === "string");
      if (typeof firstError === "string") return firstError;
    }
    return data?.detail ?? "Ocurrió un error inesperado";
  }
  return "Ocurrió un error inesperado";
}
