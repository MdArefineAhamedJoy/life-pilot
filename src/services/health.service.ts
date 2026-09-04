import { apiClient } from "@/services/api-client";

export type HealthStatus = { status: string; database?: string };
export const healthService = {
  async get() { return (await apiClient.get<HealthStatus>("/health")).data; },
  async database() { return (await apiClient.get<HealthStatus>("/health/db")).data; },
};
