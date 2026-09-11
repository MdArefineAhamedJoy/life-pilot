import type { Expense, ExpenseFilters, ExpenseSummary } from "@/types/expense.types";
import {
  apiClient,
  apiEnvelopeClient,
  type ApiResponse,
  unwrapResponse,
} from "@/services/api-client";

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

export const expensesService = {
  async list(params: ExpenseListParams): Promise<ApiResponse<Expense[]>> {
    return unwrapResponse(
      apiEnvelopeClient.get<ApiResponse<Expense[]>>("/life-os/expenses", { params })
    );
  },
  async getSummary(filters: ExpenseFilters): Promise<ApiResponse<ExpenseSummary>> {
    return unwrapResponse(
      apiEnvelopeClient.get<ApiResponse<ExpenseSummary>>("/life-os/expenses/summary", {
        params: filters,
      })
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
