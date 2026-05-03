import axios, { AxiosError, type AxiosInstance } from "axios";
import { env } from "@/shared/config";

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error(
        "[api]",
        error.response?.status,
        error.config?.method?.toUpperCase(),
        error.config?.url,
        error.message,
      );
    }
    return Promise.reject(error);
  },
);
