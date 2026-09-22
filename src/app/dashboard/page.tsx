"use client";

import { OverviewDashboard } from "@/components/dashboard/overview-dashboard";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { useLifeOs } from "@/components/state/life-os-provider";
import { useBudgetData } from "@/hooks/use-budget-data";

export default function DashboardPage() {
  const { expenses, tasks } = useLifeOs();
  const { budgets, error, isLoading, summary } = useBudgetData();

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      {error && (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      <OverviewDashboard
        budgets={budgets}
        budgetSummary={summary}
        expenses={expenses}
        tasks={tasks}
      />
    </div>
  );
}
