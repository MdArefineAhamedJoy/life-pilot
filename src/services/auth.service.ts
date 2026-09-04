import { apiClient, authStorageKey } from "@/services/api-client";

export type AuthUser = { id: string; name: string; email: string; phone?: string; imageUrl?: string };
export type AuthResponse = { user: AuthUser; token: string; expiresAt: string };
export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; phone: string; password: string; imageUrl?: string };

export const authService = {
  async login(payload: LoginPayload) {
    return (await apiClient.post<AuthResponse>("/auth/login", payload)).data;
  },
  async register(payload: RegisterPayload) {
    return (await apiClient.post<AuthResponse>("/auth/register", payload)).data;
  },
  async currentUser() {
    return (await apiClient.get<AuthUser>("/auth/me")).data;
  },
  async logout() {
    await apiClient.post("/auth/logout");
    if (typeof window !== "undefined") window.localStorage.removeItem(authStorageKey);
  },
  saveSession(session: AuthResponse) {
    window.localStorage.setItem(authStorageKey, JSON.stringify(session));
  },
};
