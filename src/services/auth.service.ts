import { apiClient, type ApiRequestConfig, unwrapResponse } from "@/services/api-client";
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
};
export type AuthResponse = { user: AuthUser; expiresAt: string };
export type LoginPayload = { email: string; password: string; rememberMe?: boolean };
export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  imageUrl?: string;
};

type AuthChangeReason = "login" | "logout";

function notifyAuthChange(reason: AuthChangeReason = "login") {
  // Share only an event marker between tabs. Credentials stay in an HttpOnly cookie.
  try {
    window.localStorage.removeItem("life-pilot-auth");
    window.localStorage.setItem(
      "life-pilot-auth-event",
      JSON.stringify({ id: crypto.randomUUID(), reason })
    );
  } catch {
    /* Browser storage may be disabled. */
  }
  window.dispatchEvent(new CustomEvent("life-pilot:auth-changed", { detail: { reason } }));
}
export const authService = {
  async login(payload: LoginPayload) {
    return unwrapResponse(apiClient.post<AuthResponse>("/auth/login", payload));
  },
  async register(payload: RegisterPayload) {
    return unwrapResponse(apiClient.post<AuthResponse>("/auth/register", payload));
  },
  async currentUser() {
    return unwrapResponse(apiClient.get<AuthUser>("/auth/me"));
  },
  async logout() {
    try {
      await apiClient.post("/auth/logout", undefined, {
        suppressToast: true,
        suppressUnauthorized: true,
      } as ApiRequestConfig);
    } finally {
      notifyAuthChange("logout");
    }
  },
  saveSession: notifyAuthChange,
  clearSession: () => notifyAuthChange("logout"),
};
