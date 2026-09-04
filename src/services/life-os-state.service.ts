import type { LifeOsState } from "@/lib/types";
import { apiClient } from "@/services/api-client";

export const lifeOsStateService = {
  async get() { return (await apiClient.get<LifeOsState>("/life-os/state")).data; },
  async replace(payload: Partial<LifeOsState>) { return (await apiClient.put<LifeOsState>("/life-os/state", payload)).data; },
  async reset() { return (await apiClient.post<LifeOsState>("/life-os/reset")).data; },
};
