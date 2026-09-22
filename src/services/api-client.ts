import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
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

export type ApiRequestConfig = AxiosRequestConfig & {
  suppressToast?: boolean;
  suppressUnauthorized?: boolean;
};

export const listRequestParams = { page: 1, limit: 100 };

const apiClientConfig = {
  baseURL: "/api",
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
};

class ApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create(apiClientConfig);

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        const requestConfig = response.config as ApiRequestConfig;
        const payload = response.data;
        const method = response.config.method?.toUpperCase();

        if (
          payload.success &&
          method &&
          method !== "GET" &&
          !requestConfig.suppressToast &&
          typeof window !== "undefined"
        ) {
          toast.success(payload.message || "Request completed successfully.");
        }

        return response;
      },
      (error: AxiosError<{ message?: string | string[] }>) => {
        const requestConfig = error.config as ApiRequestConfig | undefined;
        const publicRequest = [
          "/auth/login",
          "/auth/register",
          "/account/password-recovery",
        ].includes(error.config?.url ?? "");

        if (
          error.response?.status === 401 &&
          !publicRequest &&
          !requestConfig?.suppressUnauthorized &&
          typeof window !== "undefined"
        ) {
          window.dispatchEvent(new Event("life-pilot:unauthorized"));
        }

        const message = error.response?.data?.message;
        const detail = Array.isArray(message) ? message.join(", ") : message;
        const errorMessage = detail || error.message || "The request failed. Please try again.";

        if (!requestConfig?.suppressToast && typeof window !== "undefined") {
          toast.error(errorMessage);
        }

        const errorResponse: ApiResponse<null> = {
          success: false,
          statusCode: error.response?.status ?? 0,
          message: errorMessage,
          data: null,
        };

        // Like Guardly's API client, callers always receive the shared response shape.
        return Promise.resolve({ data: errorResponse } as AxiosResponse<ApiResponse<null>>);
      }
    );
  }

  async get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export function requireApiSuccess<T>(response: ApiResponse<T>): ApiResponse<T> {
  if (!response.success) {
    throw new Error(response.message || "The request failed. Please try again.");
  }
  return response;
}

// One shared, Guardly-style client for every browser-to-backend API request.
export const apiClient = new ApiClient();
