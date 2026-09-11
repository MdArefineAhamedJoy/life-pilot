import { apiClient, unwrapResponse } from "@/services/api-client";

export type ProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
};

export const accountService = {
  async getProfile() {
    return unwrapResponse(apiClient.get<ProfilePayload>("/account/profile"));
  },
  async saveProfile(payload: ProfilePayload) {
    return unwrapResponse(apiClient.post<ProfilePayload>("/account/profile", payload));
  },
  async requestPasswordRecovery(email: string) {
    return unwrapResponse(
      apiClient.post<{ ok: boolean; expiresAt?: string }>("/account/password-recovery", { email })
    );
  },
};
