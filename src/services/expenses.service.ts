import type { Expense } from "@/lib/types";
import { apiClient, listRequestParams, unwrapResponse } from "@/services/api-client";

export type ParsedExpenseRow = {
  itemName: string;
  category: string;
  amount: number;
  quantity?: number;
};
export const expensesService = {
  async list() {
    return unwrapResponse(
      apiClient.get<Expense[]>("/life-os/expenses", { params: listRequestParams })
    );
  },
  async create(payload: Omit<Expense, "id">) {
    return unwrapResponse(apiClient.post<Expense>("/life-os/expenses", payload));
  },
  async createBulk(rows: ParsedExpenseRow[], date?: string) {
    return unwrapResponse(apiClient.post<Expense[]>("/life-os/expenses/bulk", { rows, date }));
  },
  async remove(expenseId: string) {
    await apiClient.delete(`/life-os/expenses/${expenseId}`);
  },
};
