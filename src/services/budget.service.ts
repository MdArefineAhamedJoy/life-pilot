import { apiClient, requireApiSuccess, type ApiResponse } from "@/services/api-client";
import type {
  Budget,
  BudgetFilters,
  BudgetStatus,
  BudgetSummary,
  BudgetUsage,
} from "@/types/budget.types";

type BudgetListParams = BudgetFilters & {
  page: number;
  limit: number;
};

class BudgetService {
  async list(params: BudgetListParams): Promise<ApiResponse<BudgetUsage[]>> {
    return requireApiSuccess(await apiClient.get<BudgetUsage[]>("/life-os/budgets", { params }));
  }

  async getSummary(filters: BudgetFilters): Promise<ApiResponse<BudgetSummary>> {
    return requireApiSuccess(
      await apiClient.get<BudgetSummary>("/life-os/budgets/summary", { params: filters })
    );
  }

  async get(budgetId: string) {
    return requireApiSuccess(await apiClient.get<Budget>(`/life-os/budgets/${budgetId}`)).data;
  }

  async create(payload: Omit<Budget, "id">) {
    return requireApiSuccess(await apiClient.post<Budget>("/life-os/budgets", payload)).data;
  }

  async update(budgetId: string, payload: Partial<Budget>) {
    return requireApiSuccess(await apiClient.put<Budget>(`/life-os/budgets/${budgetId}`, payload))
      .data;
  }

  async updateStatus(budgetId: string, status: BudgetStatus) {
    return requireApiSuccess(
      await apiClient.patch<Budget>(`/life-os/budgets/${budgetId}/status`, { status })
    ).data;
  }

  async remove(budgetId: string) {
    requireApiSuccess(await apiClient.delete<void>(`/life-os/budgets/${budgetId}`));
  }
}

export const budgetService = new BudgetService();
