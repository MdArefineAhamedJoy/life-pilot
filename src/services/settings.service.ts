import type { LifeSettings } from "@/lib/types";
import { apiClient, unwrapResponse } from "@/services/api-client";

export const settingsService = {
  async get() {
    return unwrapResponse(apiClient.get<LifeSettings>("/life-os/settings"));
  },
  async update(payload: Partial<LifeSettings>) {
    return unwrapResponse(apiClient.patch<LifeSettings>("/life-os/settings", payload));
  },
};
