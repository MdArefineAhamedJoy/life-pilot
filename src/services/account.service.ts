import { apiClient } from "@/services/api-client";

export type ProfilePayload = { name?: string; email?: string; phone?: string; location?: string; role?: string; bio?: string; imageUrl?: string };

export const accountService = {
  async getProfile() {
    return (await apiClient.get<ProfilePayload>("/account/profile")).data;
  },
  async saveProfile(payload: ProfilePayload) {
    return (await apiClient.post<ProfilePayload>("/account/profile", payload)).data;
  },
  async requestPasswordRecovery(email: string) {
    return (await apiClient.post<{ ok: boolean; expiresAt?: string }>("/account/password-recovery", { email })).data;
  },
};
