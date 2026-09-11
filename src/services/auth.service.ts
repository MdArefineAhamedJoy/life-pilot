import { apiClient, unwrapResponse } from "@/services/api-client";
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
};
export type AuthResponse = { user: AuthUser; expiresAt: string };
export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  imageUrl?: string;
};

function notifyAuthChange() {
  // Share only an event marker between tabs. Credentials stay in an HttpOnly cookie.
  try {
    window.localStorage.removeItem("life-pilot-auth");
    window.localStorage.setItem("life-pilot-auth-event", crypto.randomUUID());
  } catch {
    /* Browser storage may be disabled. */
  }
  window.dispatchEvent(new Event("life-pilot:auth-changed"));
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
      await apiClient.post("/auth/logout");
    } finally {
      notifyAuthChange();
    }
  },
  saveSession: notifyAuthChange,
  clearSession: notifyAuthChange,
};
