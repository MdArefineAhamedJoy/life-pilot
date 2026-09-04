import type { Expense } from "@/lib/types";
import { apiClient } from "@/services/api-client";

export type ParsedExpenseRow = { itemName: string; category: string; amount: number; quantity?: number };
export const expensesService = {
  async list() { return (await apiClient.get<Expense[]>("/life-os/expenses")).data; },
  async create(payload: Omit<Expense, "id">) { return (await apiClient.post<Expense>("/life-os/expenses", payload)).data; },
  async createBulk(rows: ParsedExpenseRow[], date?: string) { return (await apiClient.post<Expense[]>("/life-os/expenses/bulk", { rows, date })).data; },
  async remove(expenseId: string) { await apiClient.delete(`/life-os/expenses/${expenseId}`); },
};
