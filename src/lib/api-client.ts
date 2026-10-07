import axios, { type AxiosError } from "axios";
import type { ApiResponse } from "@/types/api.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("lmp_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      sessionStorage.removeItem("lmp_token");
      sessionStorage.removeItem("lmp_user");
      document.cookie = "lmp_role=; path=/; max-age=0";
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?session=expired";
      }
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError<ApiResponse>(error)) {
    if (!error.response) {
      if (error.code === "ERR_NETWORK") {
        return "Cannot reach the server. Make sure the backend is running at http://localhost:5050";
      }
      return error.message || fallback;
    }
    const data = error.response.data;
    if (data?.errors?.length) {
      return data.errors.map((e) => e.message).join(". ");
    }
    return data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
