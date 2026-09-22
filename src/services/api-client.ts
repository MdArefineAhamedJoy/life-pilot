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
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

export type ApiRequestConfig = AxiosRequestConfig & {
  suppressToast?: boolean;
  suppressUnauthorized?: boolean;
  skipAuth?: boolean;
  _retry?: boolean;
};

type SessionSnapshot = { accessToken: string; refreshToken?: string };
type RefreshResponse = SessionSnapshot & { accessExpiresAt: string; refreshExpiresAt: string };

export const listRequestParams = { page: 1, limit: 100 };

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000/api";

class ApiClient {
  private readonly client: AxiosInstance;
  private sessionCache: SessionSnapshot | null = null;
  private sessionCacheTimestamp = 0;
  private readonly sessionCacheTtl = 5 * 60 * 1000;
  private refreshPromise: Promise<SessionSnapshot | null> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: apiBaseUrl,
      timeout: 20_000,
      headers: { "Content-Type": "application/json" },
    });

    // Same browser-session pattern as Guardly: load the signed-in session once,
    // then attach its bearer token to every backend request.
    this.client.interceptors.request.use(async (config) => {
      const requestConfig = config as ApiRequestConfig;
      const session = requestConfig.skipAuth ? null : await this.ensureSession();
      if (session?.accessToken && !requestConfig.skipAuth) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        const requestConfig = response.config as ApiRequestConfig;
        if (
          response.data.success &&
          response.config.method?.toUpperCase() !== "GET" &&
          !requestConfig.suppressToast &&
          typeof window !== "undefined"
        ) {
          toast.success(response.data.message || "Request completed successfully.");
        }
        return response;
      },
      async (error: AxiosError<{ message?: string | string[] }>) => {
        const requestConfig = error.config as ApiRequestConfig | undefined;
        const publicRequest = [
          "/auth/login",
          "/auth/register",
          "/auth/refresh",
          "/account/password-recovery",
        ].includes(error.config?.url ?? "");
        if (
          error.response?.status === 401 &&
          !publicRequest &&
          requestConfig &&
          !requestConfig?.suppressUnauthorized &&
          typeof window !== "undefined"
        ) {
          if (!requestConfig?._retry) {
            requestConfig._retry = true;
            const session = await this.refreshAccessToken();
            if (session?.accessToken) {
              requestConfig.headers = requestConfig.headers ?? {};
              requestConfig.headers.Authorization = `Bearer ${session.accessToken}`;
              return this.client.request(requestConfig);
            }
          }
          this.clearSession();
          window.dispatchEvent(new Event("life-pilot:unauthorized"));
        }

        const message = error.response?.data?.message;
        const detail = Array.isArray(message) ? message.join(", ") : message;
        const errorMessage = detail || error.message || "The request failed. Please try again.";
        if (!requestConfig?.suppressToast && typeof window !== "undefined")
          toast.error(errorMessage);

        return Promise.resolve({
          data: {
            success: false,
            statusCode: error.response?.status ?? 0,
            message: errorMessage,
            data: null,
          } satisfies ApiResponse<null>,
        } as AxiosResponse<ApiResponse<null>>);
      }
    );
  }

  private async ensureSession(force = false): Promise<SessionSnapshot | null> {
    if (typeof window === "undefined") return null;
    const now = Date.now();
    if (!force && this.sessionCache && now - this.sessionCacheTimestamp < this.sessionCacheTtl) {
      return this.sessionCache;
    }

    try {
      const response = await fetch("/api/auth/session", { credentials: "include" });
      if (!response.ok || response.status === 204) return this.cacheSession(null, now);
      const payload = (await response.json()) as { data?: SessionSnapshot };
      return this.cacheSession(payload.data?.accessToken ? payload.data : null, now);
    } catch {
      return this.cacheSession(null, now);
    }
  }

  private cacheSession(session: SessionSnapshot | null, timestamp = Date.now()) {
    this.sessionCache = session;
    this.sessionCacheTimestamp = timestamp;
    return session;
  }

  async persistSession(session: SessionSnapshot, rememberMe = false) {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...session, rememberMe }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Unable to save the sign-in session.");
    this.cacheSession(session);
  }

  private async refreshAccessToken(): Promise<SessionSnapshot | null> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      const currentSession = await this.ensureSession(true);
      if (!currentSession?.refreshToken) return null;

      const response = await this.client.post<ApiResponse<RefreshResponse>>("/auth/refresh", undefined, {
        headers: { Authorization: `Bearer ${currentSession.refreshToken}` },
        skipAuth: true,
        suppressToast: true,
        suppressUnauthorized: true,
      } as ApiRequestConfig);
      const payload = response.data;
      if (!payload.success || !payload.data?.accessToken || !payload.data.refreshToken) return null;

      const session = {
        accessToken: payload.data.accessToken,
        refreshToken: payload.data.refreshToken,
      };
      await this.persistSession(session);
      return session;
    })()
      .catch(() => null)
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  async clearSession() {
    this.cacheSession(null, 0);
    if (typeof window !== "undefined") {
      await fetch("/api/auth/session", { method: "DELETE", credentials: "include" }).catch(
        () => undefined
      );
    }
  }

  async get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return (await this.client.get<ApiResponse<T>>(url, config)).data;
  }
  async post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return (await this.client.post<ApiResponse<T>>(url, data, config)).data;
  }
  async put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return (await this.client.put<ApiResponse<T>>(url, data, config)).data;
  }
  async patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return (await this.client.patch<ApiResponse<T>>(url, data, config)).data;
  }
  async delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return (await this.client.delete<ApiResponse<T>>(url, config)).data;
  }
}

export function requireApiSuccess<T>(response: ApiResponse<T>): ApiResponse<T> {
  if (!response.success) throw new Error(response.message || "The request failed.");
  return response;
}

export const apiClient = new ApiClient();
