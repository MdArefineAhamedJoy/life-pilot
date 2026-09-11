import type { RoutineStatus, RoutineTask } from "@/lib/types";
import { apiClient, listRequestParams, unwrapResponse } from "@/services/api-client";

export const tasksService = {
  async list() {
    return unwrapResponse(
      apiClient.get<RoutineTask[]>("/life-os/tasks", { params: listRequestParams })
    );
  },
  async create(payload: Omit<RoutineTask, "id">) {
    return unwrapResponse(apiClient.post<RoutineTask>("/life-os/tasks", payload));
  },
  async update(taskId: string, payload: Partial<RoutineTask>) {
    return unwrapResponse(apiClient.patch<RoutineTask>(`/life-os/tasks/${taskId}`, payload));
  },
  async updateStatus(taskId: string, status: RoutineStatus) {
    return unwrapResponse(
      apiClient.patch<RoutineTask>(`/life-os/tasks/${taskId}/status`, { status })
    );
  },
  async reorder(orderedTaskIds: string[]) {
    return unwrapResponse(
      apiClient.patch<RoutineTask[]>("/life-os/tasks/reorder", { orderedTaskIds })
    );
  },
  async remove(taskId: string) {
    await apiClient.delete(`/life-os/tasks/${taskId}`);
  },
};
