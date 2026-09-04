import type { RoutineStatus, RoutineTask } from "@/lib/types";
import { apiClient } from "@/services/api-client";

export const tasksService = {
  async list() { return (await apiClient.get<RoutineTask[]>("/life-os/tasks")).data; },
  async create(payload: Omit<RoutineTask, "id">) { return (await apiClient.post<RoutineTask>("/life-os/tasks", payload)).data; },
  async update(taskId: string, payload: Partial<RoutineTask>) { return (await apiClient.patch<RoutineTask>(`/life-os/tasks/${taskId}`, payload)).data; },
  async updateStatus(taskId: string, status: RoutineStatus) { return (await apiClient.patch<RoutineTask>(`/life-os/tasks/${taskId}/status`, { status })).data; },
  async reorder(orderedTaskIds: string[]) { return (await apiClient.patch<RoutineTask[]>("/life-os/tasks/reorder", { orderedTaskIds })).data; },
  async remove(taskId: string) { await apiClient.delete(`/life-os/tasks/${taskId}`); },
};
