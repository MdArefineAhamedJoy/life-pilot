import { apiClient, requireApiSuccess, type ApiRequestConfig } from "@/services/api-client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
};
export type AuthResponse = { user: AuthUser; expiresAt: string };
type AuthSessionResponse = AuthResponse & {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
};
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

class AuthService {
  async login(payload: LoginPayload) {
    return this.startSession(payload, "/auth/login");
  }

  async register(payload: RegisterPayload) {
    return this.startSession(payload, "/auth/register");
  }

  async currentUser(config?: ApiRequestConfig) {
    return requireApiSuccess(await apiClient.get<AuthUser>("/auth/me", config)).data;
  }

  async logout() {
    try {
      requireApiSuccess(
        await apiClient.post("/auth/logout", undefined, {
          suppressToast: true,
          suppressUnauthorized: true,
        })
      );
    } finally {
      await apiClient.clearSession();
      notifyAuthChange("logout");
    }
  }

  private async startSession(payload: LoginPayload | RegisterPayload, endpoint: string) {
    const session = requireApiSuccess(
      await apiClient.post<AuthSessionResponse>(endpoint, payload, { suppressToast: true })
    ).data;
    await apiClient.persistSession(
      { accessToken: session.accessToken, refreshToken: session.refreshToken },
      "rememberMe" in payload && Boolean(payload.rememberMe)
    );
    return { user: session.user, expiresAt: session.accessExpiresAt };
  }

  saveSession() {
    notifyAuthChange("login");
  }

  clearSession() {
    notifyAuthChange("logout");
  }
}

export const authService = new AuthService();
