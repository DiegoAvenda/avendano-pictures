// src/lib/axios.ts – Axios instance with credentials & interceptors
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';

/**
 * The backend always replies with a `{ success, data?, message? }` envelope.
 * The response interceptor below unwraps it, so callers receive the `data`
 * payload directly. `ApiClient` mirrors that runtime behaviour for TypeScript.
 */
interface ApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// Base URL is proxied via the Vite dev server (see vite.config.ts proxy)
const instance = axios.create({
  baseURL: '/api',
  withCredentials: true, // send HTTP-Only cookies automatically
});

// Optionally attach a token (kept for flexibility; not needed with httpOnly cookies)
instance.interceptors.request.use((config) => {
  // Example: const token = getCookie('token'); if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response interceptor – unwrap our standard { success, data, message } shape
instance.interceptors.response.use(
  (response) => {
    const data: ApiResponse = response.data;
    if (data.success) {
      return data.data;
    }
    // Throw to trigger query error handling
    return Promise.reject(new Error(data.message || 'Unknown error'));
  },
  (error: AxiosError<ApiResponse>) => {
    // Map status codes to (optionally) custom messages
    const msg = error.response?.data?.message || error.message;
    return Promise.reject(new Error(msg));
  }
);

// Cast to the typed client that exposes the unwrapped payload
const api = instance as unknown as ApiClient;

export default api;
