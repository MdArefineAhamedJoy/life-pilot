import { apiClient, requireApiSuccess } from "@/services/api-client";

export type ProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
};

class AccountService {
  async getProfile() {
    return requireApiSuccess(await apiClient.get<ProfilePayload>("/account/profile")).data;
  }

  async saveProfile(payload: ProfilePayload) {
    return requireApiSuccess(await apiClient.post<ProfilePayload>("/account/profile", payload))
      .data;
  }

  async requestPasswordRecovery(email: string) {
    return requireApiSuccess(
      await apiClient.post<{ ok: boolean; expiresAt?: string }>("/account/password-recovery", {
        email,
      })
    ).data;
  }

  async resetPassword(token: string, password: string, passwordConfirmation: string) {
    return requireApiSuccess(
      await apiClient.post<{ ok: boolean }>("/account/password-reset", {
        token,
        password,
        passwordConfirmation,
      })
    ).data;
  }
}

export const accountService = new AccountService();
