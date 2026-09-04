import type { BudgetCategory, Expense, RoutineTask } from "@/lib/types";

export function getTotalSpent(expenses: Expense[]) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function getCategorySpent(expenses: Expense[], category: string) {
  return expenses
    .filter((expense) => expense.category === category)
    .reduce((total, expense) => total + expense.amount, 0);
}

export function getBudgetUsage(categories: BudgetCategory[], expenses: Expense[]) {
  return categories.map((category) => {
    const spent = getCategorySpent(expenses, category.name);
    const limit = category.monthlyLimit;
    const remaining = limit - spent;
    const percent = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;

    return {
      ...category,
      spent,
      remaining,
      percent,
      isOverBudget: remaining < 0,
    };
  });
}

export function getRoutineProgress(tasks: RoutineTask[]) {
  if (tasks.length === 0) {
    return 0;
  }

  const completed = tasks.filter((task) => task.status === "completed").length;
  return Math.round((completed / tasks.length) * 100);
}

export function parseReceiptText(rawText: string) {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const amountMatch = line.match(/(\d+(?:\.\d+)?)\s*$/);
      const amount = amountMatch ? Number(amountMatch[1]) : 0;
      const itemName = amountMatch ? line.slice(0, amountMatch.index).trim() : line;

      return {
        id: `parsed-${index + 1}`,
        itemName: itemName || "Unknown item",
        category: "Uncategorized",
        quantity: 1,
        amount,
      };
    });
}
