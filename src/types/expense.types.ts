import type { Expense } from "@/lib/types";

export type ExpenseFilters = {
  search?: string;
  date?: string;
  category?: string;
  paymentMethod?: string;
};

export type ExpenseSummary = {
  totalAmount: number;
  transactionCount: number;
  totalRecordCount: number;
  averageAmount: number;
};

export type { Expense };
