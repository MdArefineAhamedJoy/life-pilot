import type { BudgetCategory } from "@/lib/types";
import { apiClient, listRequestParams, unwrapResponse } from "@/services/api-client";

export const categoriesService = {
  async list() {
    const categories = await unwrapResponse(
      apiClient.get<BudgetCategory[]>("/life-os/categories", { params: listRequestParams })
    );
    if (!Array.isArray(categories)) {
      throw new Error("The categories API returned an invalid list response.");
    }
    return categories;
  },
  async get(categoryId: string) {
    return unwrapResponse(apiClient.get<BudgetCategory>(`/life-os/categories/${categoryId}`));
  },
  async create(payload: Omit<BudgetCategory, "id">) {
    return unwrapResponse(apiClient.post<BudgetCategory>("/life-os/categories", payload));
  },
  async update(categoryId: string, payload: Partial<BudgetCategory>) {
    return unwrapResponse(
      apiClient.put<BudgetCategory>(`/life-os/categories/${categoryId}`, payload)
    );
  },
  async updateLimit(categoryId: string, monthlyLimit: number) {
    return unwrapResponse(
      apiClient.patch<BudgetCategory>(`/life-os/categories/${categoryId}/limit`, { monthlyLimit })
    );
  },
  async remove(categoryId: string) {
    await apiClient.delete(`/life-os/categories/${categoryId}`);
  },
};
