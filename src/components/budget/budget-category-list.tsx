import type { BudgetCategory, Expense } from "@/lib/types";
import { getBudgetUsage } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

type BudgetCategoryListProps = {
  categories: BudgetCategory[];
  expenses: Expense[];
};

export function BudgetCategoryList({ categories, expenses }: BudgetCategoryListProps) {
  const usage = getBudgetUsage(categories, expenses);

  return (
    <Card title="Budget Categories" eyebrow="Budget">
      <div className="space-y-4">
        {usage.map((category) => (
          <div className="space-y-2 border-b border-slate-200 pb-4 last:border-0 last:pb-0" key={category.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">{category.name}</h3>
                  <Badge tone={category.color as "teal" | "amber" | "rose" | "indigo"}>{category.type}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {formatCurrency(category.spent)} spent of {formatCurrency(category.monthlyLimit)}
                </p>
              </div>
              <p className={category.isOverBudget ? "text-sm font-semibold text-red-500" : "text-sm font-semibold text-emerald-600"}>
                {formatCurrency(category.remaining)}
              </p>
            </div>
            <ProgressBar
              value={category.percent}
              tone={category.isOverBudget ? "rose" : (category.color as "teal" | "amber" | "rose" | "indigo")}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
