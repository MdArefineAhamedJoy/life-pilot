import type { LifeSettings } from "@/lib/types";
import { apiClient, requireApiSuccess } from "@/services/api-client";

class SettingsService {
  async get() {
    return requireApiSuccess(await apiClient.get<LifeSettings>("/life-os/settings")).data;
  }

  async update(payload: Partial<LifeSettings>) {
    return requireApiSuccess(await apiClient.patch<LifeSettings>("/life-os/settings", payload))
      .data;
  }
}

export const settingsService = new SettingsService();
