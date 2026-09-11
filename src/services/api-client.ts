import axios, { AxiosError, type AxiosResponse } from "axios";
import { toast } from "sonner";

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function unwrapResponse<T>(request: Promise<AxiosResponse<T>>) {
  return (await request).data;
}

export const listRequestParams = { page: 1, limit: 100 };
const apiClientConfig = {
  baseURL: "/api",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
};

function handleApiError(error: AxiosError<{ message?: string | string[] }>) {
  const publicRequest = ["/auth/login", "/auth/register", "/account/password-recovery"].includes(
    error.config?.url ?? ""
  );
  if (error.response?.status === 401 && !publicRequest && typeof window !== "undefined") {
    window.dispatchEvent(new Event("life-pilot:unauthorized"));
  }
  const message = error.response?.data?.message;
  const detail = Array.isArray(message) ? message.join(", ") : message;
  if (typeof window !== "undefined") {
    toast.error(detail || error.message || "The request failed. Please try again.");
  }
  return Promise.reject(
    new Error(detail || error.message || "The request failed. Please try again.")
  );
}

export const apiClient = axios.create(apiClientConfig);
export const apiEnvelopeClient = axios.create(apiClientConfig);

apiClient.interceptors.response.use((response) => {
  const payload = response.data as Partial<ApiResponse<unknown>>;
  if (typeof payload?.success === "boolean" && "data" in payload) {
    response.data = payload.data;
    const method = response.config.method?.toUpperCase();
    if (method && method !== "GET" && typeof window !== "undefined") {
      toast.success(payload.message || "Request completed successfully.");
    }
  }
  return response;
}, handleApiError);

apiEnvelopeClient.interceptors.response.use((response) => response, handleApiError);
