import type { AlertItem, BudgetCategory, Expense, RoutineTask } from "@/lib/types";
import { getBudgetUsage, getRoutineProgress, getTotalSpent } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { AlertList } from "@/components/dashboard/alert-list";
import { MetricCard } from "@/components/dashboard/metric-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SectionHeader } from "@/components/ui/section-header";

type OverviewDashboardProps = {
  categories: BudgetCategory[];
  expenses: Expense[];
  tasks: RoutineTask[];
  alerts: AlertItem[];
};

export function OverviewDashboard({ categories, expenses, tasks, alerts }: OverviewDashboardProps) {
  const totalBudget = categories.reduce((total, category) => total + category.monthlyLimit, 0);
  const totalSpent = getTotalSpent(expenses);
  const budgetProgress = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const routineProgress = getRoutineProgress(tasks);
  const activeTask = tasks.find((task) => task.status === "active");
  const missedCount = tasks.filter((task) => task.status === "missed" || task.status === "delayed").length;
  const overBudgetCount = getBudgetUsage(categories, expenses).filter((category) => category.isOverBudget).length;

  return (
    <section className="min-w-0 space-y-5 sm:space-y-6" id="dashboard">
      <SectionHeader
        eyebrow="Dashboard"
        title="Daily life command center"
        description="Budget, bajar cost, routine, timer, alerts, and personal data in one practical screen."
      />
      <QuickActions />
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          detail={`${formatCurrency(totalBudget - totalSpent)} remaining this month`}
          label="Monthly spending"
          progress={budgetProgress}
          tone="teal"
          value={formatCurrency(totalSpent)}
        />
        <MetricCard
          detail={`${tasks.length} planned tasks today`}
          label="Routine progress"
          progress={routineProgress}
          tone="indigo"
          value={`${routineProgress}%`}
        />
        <MetricCard
          detail={activeTask ? `${activeTask.plannedStart} - ${activeTask.plannedEnd}` : "No active task right now"}
          label="Active work"
          tone="amber"
          value={activeTask?.title ?? "Clear"}
        />
        <MetricCard
          detail={`${overBudgetCount} budget alerts`}
          label="Delayed or missed"
          tone="rose"
          value={`${missedCount}`}
        />
      </div>
      <AlertList alerts={alerts} />
    </section>
  );
}
