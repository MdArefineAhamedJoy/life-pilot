import type { LifeOsState } from "@/lib/types";
import { apiClient, requireApiSuccess } from "@/services/api-client";

class LifeOsStateService {
  async get(signal?: AbortSignal) {
    return requireApiSuccess(await apiClient.get<LifeOsState>("/life-os/state", { signal })).data;
  }

  async replace(payload: Partial<LifeOsState>) {
    return requireApiSuccess(await apiClient.put<LifeOsState>("/life-os/state", payload)).data;
  }

  async reset() {
    return requireApiSuccess(await apiClient.post<LifeOsState>("/life-os/reset")).data;
  }
}

export const lifeOsStateService = new LifeOsStateService();
