import type { TimerSession } from "@/lib/types";
import { apiClient, listRequestParams, requireApiSuccess } from "@/services/api-client";

class TimerSessionsService {
  async list() {
    return requireApiSuccess(
      await apiClient.get<TimerSession[]>("/life-os/timer-sessions", { params: listRequestParams })
    ).data;
  }

  async create(payload: Omit<TimerSession, "id" | "createdAt">) {
    return requireApiSuccess(await apiClient.post<TimerSession>("/life-os/timer-sessions", payload))
      .data;
  }
}

export const timerSessionsService = new TimerSessionsService();
