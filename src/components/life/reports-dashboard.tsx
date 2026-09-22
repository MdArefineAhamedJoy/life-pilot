"use client";
import { useFormatCurrency } from "@/hooks/use-format-currency";

import { localDateKey } from "@/lib/utils";
import { BudgetCategoryList } from "@/components/budget/budget-category-list";
import { MetricCard } from "@/components/dashboard/metric-card";
import { useLifeOs } from "@/components/state/life-os-provider";
import { useBudgetData } from "@/hooks/use-budget-data";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getRoutineProgress, getTotalSpent } from "@/lib/calculations";

export function ReportsDashboard() {
  const formatCurrency = useFormatCurrency();
  const { expenses, tasks, timerSessions } = useLifeOs();
  const { budgets, error, summary } = useBudgetData();
  const totalBudget = summary?.totalBudget ?? 0;
  const totalSpent = getTotalSpent(
    expenses.filter((expense) => expense.date.slice(0, 7) === localDateKey().slice(0, 7))
  );
  const routineProgress = getRoutineProgress(tasks);
  const totalFocusSeconds = timerSessions.reduce(
    (sum, session) => sum + session.durationSeconds,
    0
  );
  const focusHours = (totalFocusSeconds / 3600).toFixed(1);
  const share = (count: number) => (tasks.length ? Math.round((count / tasks.length) * 100) : 0);

  return (
    <div className="space-y-5">
      {error && (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          detail={`${formatCurrency(Math.max(totalBudget - totalSpent, 0))} remaining`}
          label="Monthly spend"
          progress={totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}
          tone="teal"
          value={formatCurrency(totalSpent)}
        />
        <MetricCard
          detail={`${tasks.length} tasks tracked`}
          label="Routine completion"
          progress={routineProgress}
          tone="indigo"
          value={`${routineProgress}%`}
        />
        <MetricCard
          detail="Saved timer sessions"
          label="Focus time"
          tone="amber"
          value={`${focusHours}h`}
        />
      </div>
      <div className="grid min-w-0 gap-5 2xl:grid-cols-[1fr_1fr]">
        <BudgetCategoryList budgets={budgets} />
        <Card title="Work-Life Balance" eyebrow="Routine report">
          <div className="space-y-4">
            <ProgressBar
              label="Work tasks"
              tone="indigo"
              value={share(tasks.filter((task) => task.category.toLowerCase() === "work").length)}
            />
            <ProgressBar
              label="Family and personal tasks"
              tone="teal"
              value={share(
                tasks.filter((task) => ["family", "personal"].includes(task.category.toLowerCase()))
                  .length
              )}
            />
            <ProgressBar
              label="Delayed or missed tasks"
              tone="rose"
              value={share(
                tasks.filter((task) => ["delayed", "missed"].includes(task.status)).length
              )}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
