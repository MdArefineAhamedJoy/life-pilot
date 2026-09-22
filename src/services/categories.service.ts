import type { BudgetCategory } from "@/lib/types";
import { apiClient, listRequestParams, requireApiSuccess } from "@/services/api-client";

class CategoriesService {
  async list() {
    const categories = requireApiSuccess(
      await apiClient.get<BudgetCategory[]>("/life-os/categories", { params: listRequestParams })
    ).data;
    if (!Array.isArray(categories)) {
      throw new Error("The categories API returned an invalid list response.");
    }
    return categories;
  }

  async get(categoryId: string) {
    return requireApiSuccess(
      await apiClient.get<BudgetCategory>(`/life-os/categories/${categoryId}`)
    ).data;
  }

  async create(payload: Omit<BudgetCategory, "id">) {
    return requireApiSuccess(await apiClient.post<BudgetCategory>("/life-os/categories", payload))
      .data;
  }

  async update(categoryId: string, payload: Partial<BudgetCategory>) {
    return requireApiSuccess(
      await apiClient.put<BudgetCategory>(`/life-os/categories/${categoryId}`, payload)
    ).data;
  }

  async updateLimit(categoryId: string, monthlyLimit: number) {
    return requireApiSuccess(
      await apiClient.patch<BudgetCategory>(`/life-os/categories/${categoryId}/limit`, {
        monthlyLimit,
      })
    ).data;
  }

  async remove(categoryId: string) {
    requireApiSuccess(await apiClient.delete<void>(`/life-os/categories/${categoryId}`));
  }
}

export const categoriesService = new CategoriesService();
