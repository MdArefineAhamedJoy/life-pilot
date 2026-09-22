import type { RoutineStatus, RoutineTask } from "@/lib/types";
import { apiClient, listRequestParams, requireApiSuccess } from "@/services/api-client";

class TasksService {
  async list() {
    return requireApiSuccess(
      await apiClient.get<RoutineTask[]>("/life-os/tasks", { params: listRequestParams })
    ).data;
  }

  async create(payload: Omit<RoutineTask, "id">) {
    return requireApiSuccess(await apiClient.post<RoutineTask>("/life-os/tasks", payload)).data;
  }

  async update(taskId: string, payload: Partial<RoutineTask>) {
    return requireApiSuccess(
      await apiClient.patch<RoutineTask>(`/life-os/tasks/${taskId}`, payload)
    ).data;
  }

  async updateStatus(taskId: string, status: RoutineStatus) {
    return requireApiSuccess(
      await apiClient.patch<RoutineTask>(`/life-os/tasks/${taskId}/status`, { status })
    ).data;
  }

  async reorder(orderedTaskIds: string[]) {
    return requireApiSuccess(
      await apiClient.patch<RoutineTask[]>("/life-os/tasks/reorder", { orderedTaskIds })
    ).data;
  }

  async remove(taskId: string) {
    requireApiSuccess(await apiClient.delete<void>(`/life-os/tasks/${taskId}`));
  }
}

export const tasksService = new TasksService();
