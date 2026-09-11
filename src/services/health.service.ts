import { apiClient, unwrapResponse } from "@/services/api-client";

export type HealthStatus = { status: string; database?: string };
export const healthService = {
  async get() {
    return unwrapResponse(apiClient.get<HealthStatus>("/health"));
  },
  async database() {
    return unwrapResponse(apiClient.get<HealthStatus>("/health/db"));
  },
};
