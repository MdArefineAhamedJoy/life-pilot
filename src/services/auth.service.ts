import { apiClient } from "@/services/api-client";
export type AuthUser = { id: string; name: string; email: string; phone?: string; imageUrl?: string };
export type AuthResponse = { user: AuthUser; expiresAt: string };
export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; phone: string; password: string; imageUrl?: string };

function notifyAuthChange() {
  // Share only an event marker between tabs. Credentials stay in an HttpOnly cookie.
  try {
    window.localStorage.removeItem("life-pilot-auth");
    window.localStorage.setItem("life-pilot-auth-event", crypto.randomUUID());
  } catch { /* Browser storage may be disabled. */ }
  window.dispatchEvent(new Event("life-pilot:auth-changed"));
}
export const authService = {
  async login(payload: LoginPayload) { return (await apiClient.post<AuthResponse>("/auth/login", payload)).data; },
  async register(payload: RegisterPayload) { return (await apiClient.post<AuthResponse>("/auth/register", payload)).data; },
  async currentUser() { return (await apiClient.get<AuthUser>("/auth/me")).data; },
  async logout() {
    try { await apiClient.post("/auth/logout"); } finally { notifyAuthChange(); }
  },
  saveSession: notifyAuthChange,
  clearSession: notifyAuthChange,
};
