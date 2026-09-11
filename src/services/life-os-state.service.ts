import type { LifeOsState } from "@/lib/types";
import { apiClient, unwrapResponse } from "@/services/api-client";

export const lifeOsStateService = {
  async get(signal?: AbortSignal) {
    return unwrapResponse(apiClient.get<LifeOsState>("/life-os/state", { signal }));
  },
  async replace(payload: Partial<LifeOsState>) {
    return unwrapResponse(apiClient.put<LifeOsState>("/life-os/state", payload));
  },
  async reset() {
    return unwrapResponse(apiClient.post<LifeOsState>("/life-os/reset"));
  },
};
