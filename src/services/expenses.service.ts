import { apiClient, requireApiSuccess, type ApiResponse } from "@/services/api-client";
import type { Expense, ExpenseFilters, ExpenseSummary } from "@/types/expense.types";

export type ParsedExpenseRow = {
  itemName: string;
  category: string;
  amount: number;
  quantity?: number;
};

type ExpenseListParams = ExpenseFilters & {
  page: number;
  limit: number;
};

class ExpensesService {
  async list(params: ExpenseListParams): Promise<ApiResponse<Expense[]>> {
    return requireApiSuccess(await apiClient.get<Expense[]>("/life-os/expenses", { params }));
  }

  async getSummary(filters: ExpenseFilters): Promise<ApiResponse<ExpenseSummary>> {
    return requireApiSuccess(
      await apiClient.get<ExpenseSummary>("/life-os/expenses/summary", { params: filters })
    );
  }

  async create(payload: Omit<Expense, "id">) {
    return requireApiSuccess(await apiClient.post<Expense>("/life-os/expenses", payload)).data;
  }

  async createBulk(rows: ParsedExpenseRow[], date?: string) {
    return requireApiSuccess(
      await apiClient.post<Expense[]>("/life-os/expenses/bulk", { rows, date })
    ).data;
  }

  async remove(expenseId: string) {
    requireApiSuccess(await apiClient.delete<void>(`/life-os/expenses/${expenseId}`));
  }
}

export const expensesService = new ExpensesService();
