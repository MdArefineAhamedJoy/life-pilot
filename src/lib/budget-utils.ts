import { formatDateRange } from "@/lib/date-utils";
import type { Budget, BudgetStatus } from "@/types/budget.types";

export const budgetStatusLabels: Record<BudgetStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};

export function getBudgetStatus(budget: Pick<Budget, "status" | "isActive">): BudgetStatus {
  return budget.status ?? (budget.isActive ? "active" : "paused");
}

export function getBudgetDateRange(budget: Pick<Budget, "startDate" | "endDate">) {
  return formatDateRange(budget.startDate, budget.endDate);
}

export function getNextBudgetStatus(status: BudgetStatus): BudgetStatus {
  if (status === "active") {
    return "paused";
  }

  if (status === "paused") {
    return "completed";
  }

  return "active";
}
