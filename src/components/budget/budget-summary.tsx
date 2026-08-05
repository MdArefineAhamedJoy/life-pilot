import type { BudgetCategory, Expense } from "@/lib/types";
import { getBudgetUsage, getTotalSpent } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { MetricCard } from "@/components/dashboard/metric-card";

type BudgetSummaryProps = {
  categories: BudgetCategory[];
  expenses: Expense[];
};

export function BudgetSummary({ categories, expenses }: BudgetSummaryProps) {
  const totalBudget = categories.reduce((total, category) => total + category.monthlyLimit, 0);
  const totalSpent = getTotalSpent(expenses);
  const todaySpent = getTotalSpent(expenses.filter((expense) => expense.date === "2026-08-05"));
  const biggestCategory = getBudgetUsage(categories, expenses).sort((a, b) => b.spent - a.spent)[0];

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        detail={`${formatCurrency(totalBudget - totalSpent)} remaining`}
        label="Total budget use"
        progress={totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}
        tone="teal"
        value={formatCurrency(totalSpent)}
      />
      <MetricCard detail="Tracked for today" label="Today spent" tone="amber" value={formatCurrency(todaySpent)} />
      <MetricCard detail="Highest spending bucket" label="Top category" tone="indigo" value={biggestCategory?.name ?? "None"} />
    </div>
  );
}
