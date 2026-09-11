import {
  apiClient,
  apiEnvelopeClient,
  type ApiResponse,
  unwrapResponse,
} from "@/services/api-client";
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

export const budgetService = {
  async list(params: BudgetListParams): Promise<ApiResponse<BudgetUsage[]>> {
    return unwrapResponse(
      apiEnvelopeClient.get<ApiResponse<BudgetUsage[]>>("/life-os/budgets", { params })
    );
  },
  async getSummary(filters: BudgetFilters): Promise<ApiResponse<BudgetSummary>> {
    return unwrapResponse(
      apiEnvelopeClient.get<ApiResponse<BudgetSummary>>("/life-os/budgets/summary", {
        params: filters,
      })
    );
  },
  async get(budgetId: string) {
    return unwrapResponse(apiClient.get<Budget>(`/life-os/budgets/${budgetId}`));
  },
  async create(payload: Omit<Budget, "id">) {
    return unwrapResponse(apiClient.post<Budget>("/life-os/budgets", payload));
  },
  async update(budgetId: string, payload: Partial<Budget>) {
    return unwrapResponse(apiClient.put<Budget>(`/life-os/budgets/${budgetId}`, payload));
  },
  async updateStatus(budgetId: string, status: BudgetStatus) {
    return unwrapResponse(
      apiClient.patch<Budget>(`/life-os/budgets/${budgetId}/status`, { status })
    );
  },
  async remove(budgetId: string) {
    await apiClient.delete(`/life-os/budgets/${budgetId}`);
  },
};
