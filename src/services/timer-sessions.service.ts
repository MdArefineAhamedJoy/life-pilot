import type { TimerSession } from "@/lib/types";
import { apiClient, listRequestParams, unwrapResponse } from "@/services/api-client";

export const timerSessionsService = {
  async list() {
    return unwrapResponse(
      apiClient.get<TimerSession[]>("/life-os/timer-sessions", { params: listRequestParams })
    );
  },
  async create(payload: Omit<TimerSession, "id" | "createdAt">) {
    return unwrapResponse(apiClient.post<TimerSession>("/life-os/timer-sessions", payload));
  },
};
