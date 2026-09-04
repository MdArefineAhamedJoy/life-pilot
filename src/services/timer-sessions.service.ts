import type { TimerSession } from "@/lib/types";
import { apiClient } from "@/services/api-client";

export const timerSessionsService = {
  async list() { return (await apiClient.get<TimerSession[]>("/life-os/timer-sessions")).data; },
  async create(payload: Omit<TimerSession, "id" | "createdAt">) { return (await apiClient.post<TimerSession>("/life-os/timer-sessions", payload)).data; },
};
