import axios, { AxiosError } from "axios";

const defaultApiBaseUrl = "http://localhost:4000/api";
const authStorageKey = "life-pilot-auth";

const baseURL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultApiBaseUrl).replace(/\/$/, "");

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  try {
    const session = JSON.parse(window.localStorage.getItem(authStorageKey) ?? "null") as { token?: string } | null;
    if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  } catch {
    // A malformed local session should not prevent public API calls.
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(authStorageKey);
      window.dispatchEvent(new Event("life-pilot:unauthorized"));
    }

    const message = error.response?.data?.message;
    const detail = Array.isArray(message) ? message.join(", ") : message;
    return Promise.reject(new Error(detail || error.message || "Something went wrong. Please try again."));
  },
);

export { authStorageKey };
