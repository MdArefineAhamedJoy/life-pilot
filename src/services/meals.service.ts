import { apiClient, requireApiSuccess } from "@/services/api-client";
import type { MealPlan, MealStatus, MealSummary } from "@/types/meal.types";

type MealFilters = { dateFrom?: string; dateTo?: string; status?: MealStatus };

class MealsService {
  async list(filters: MealFilters): Promise<MealPlan[]> {
    return requireApiSuccess(await apiClient.get<MealPlan[]>("/life-os/meals", { params: filters })).data;
  }
  async summary(filters: MealFilters): Promise<MealSummary> {
    return requireApiSuccess(await apiClient.get<MealSummary>("/life-os/meals/summary", { params: filters })).data;
  }
  async create(payload: Omit<MealPlan, "id">) {
    return requireApiSuccess(await apiClient.post<MealPlan>("/life-os/meals", payload)).data;
  }
  async organise(rawInput: string, date: string) {
    return requireApiSuccess(await apiClient.post<MealPlan>("/life-os/meals/organise", { rawInput, date })).data;
  }
  async update(id: string, payload: Partial<MealPlan>) {
    return requireApiSuccess(await apiClient.put<MealPlan>(`/life-os/meals/${id}`, payload)).data;
  }
  async updateStatus(id: string, status: MealStatus) {
    return requireApiSuccess(await apiClient.patch<MealPlan>(`/life-os/meals/${id}/status`, { status })).data;
  }
  async remove(id: string) {
    requireApiSuccess(await apiClient.delete<void>(`/life-os/meals/${id}`));
  }
}

export const mealsService = new MealsService();
