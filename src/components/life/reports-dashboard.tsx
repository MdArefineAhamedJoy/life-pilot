"use client";

import { BudgetCategoryList } from "@/components/budget/budget-category-list";
import { MetricCard } from "@/components/dashboard/metric-card";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getRoutineProgress, getTotalSpent } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";

export function ReportsDashboard() {
  const { categories, expenses, tasks, timerSessions } = useLifeOs();
  const totalBudget = categories.reduce((sum, category) => sum + category.monthlyLimit, 0);
  const totalSpent = getTotalSpent(expenses);
  const routineProgress = getRoutineProgress(tasks);
  const totalFocusSeconds = timerSessions.reduce((sum, session) => sum + session.durationSeconds, 0);
  const focusHours = (totalFocusSeconds / 3600).toFixed(1);

  return (
    <div className="space-y-5">
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
        <MetricCard detail="Saved timer sessions" label="Focus time" tone="amber" value={`${focusHours}h`} />
      </div>
      <div className="grid min-w-0 gap-5 2xl:grid-cols-[1fr_1fr]">
        <BudgetCategoryList categories={categories} expenses={expenses} />
        <Card title="Work-Life Balance" eyebrow="Routine report">
          <div className="space-y-4">
            <ProgressBar label="Work blocks" tone="indigo" value={60} />
            <ProgressBar label="Family and personal time" tone="teal" value={45} />
            <ProgressBar label="Delayed tasks" tone="rose" value={tasks.filter((task) => task.status === "missed").length * 20} />
          </div>
        </Card>
      </div>
    </div>
  );
}
