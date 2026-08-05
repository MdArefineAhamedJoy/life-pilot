"use client";

import { OverviewDashboard } from "@/components/dashboard/overview-dashboard";
import { alerts } from "@/lib/life-os-data";
import { useLifeOs } from "@/components/state/life-os-provider";

export default function Home() {
  const { categories, expenses, tasks } = useLifeOs();

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      <OverviewDashboard alerts={alerts} categories={categories} expenses={expenses} tasks={tasks} />
    </div>
  );
}
