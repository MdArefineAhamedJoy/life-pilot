"use client";
import { useLifeOs } from "@/components/state/life-os-provider";
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard";
export function DailyBriefingSection() {
  const { categories, expenses, tasks } = useLifeOs();
  return <section className="mx-auto max-w-[1200px] p-6"><OverviewDashboard categories={categories} expenses={expenses} tasks={tasks} /></section>;
}
