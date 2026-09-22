import { apiClient, requireApiSuccess } from "@/services/api-client";

export type HealthStatus = { status: string; database?: string };

class HealthService {
  async get() {
    return requireApiSuccess(await apiClient.get<HealthStatus>("/health")).data;
  }

  async database() {
    return requireApiSuccess(await apiClient.get<HealthStatus>("/health/db")).data;
  }
}

export const healthService = new HealthService();
