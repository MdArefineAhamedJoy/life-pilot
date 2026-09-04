import type { LifeSettings } from "@/lib/types";
import { apiClient } from "@/services/api-client";

export const settingsService = {
  async get() { return (await apiClient.get<LifeSettings>("/life-os/settings")).data; },
  async update(payload: Partial<LifeSettings>) { return (await apiClient.patch<LifeSettings>("/life-os/settings", payload)).data; },
};
