import type { BudgetCategory } from "@/lib/types";
import { apiClient } from "@/services/api-client";

export const categoriesService = {
  async list() {
    return (await apiClient.get<BudgetCategory[]>("/life-os/categories")).data;
  },
  async create(payload: Omit<BudgetCategory, "id">) {
    return (
      await apiClient.post<BudgetCategory>("/life-os/categories", payload)
    ).data;
  },
  async update(categoryId: string, payload: Partial<BudgetCategory>) {
    return (
      await apiClient.put<BudgetCategory>(
        `/life-os/categories/${categoryId}`,
        payload,
      )
    ).data;
  },
  async updateLimit(categoryId: string, monthlyLimit: number) {
    return (
      await apiClient.patch<BudgetCategory>(
        `/life-os/categories/${categoryId}/limit`,
        { monthlyLimit },
      )
    ).data;
  },
  async remove(categoryId: string) {
    await apiClient.delete(`/life-os/categories/${categoryId}`);
  },
};
