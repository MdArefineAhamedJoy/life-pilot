"use client";

import Link from "next/link";
import { Camera, CheckCircle2, Circle, Clock3, CreditCard, ExternalLink, PiggyBank, Plus, WalletCards, XCircle } from "lucide-react";
import { useState } from "react";
import { SharedCard, SharedCardHeader, StatCard } from "@/components/shared/card";
import { getCategorySpent, getRoutineProgress, getTotalSpent } from "@/lib/calculations";
import type { BudgetCategory, Expense, RoutineTask } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type OverviewDashboardProps = {
  categories: BudgetCategory[];
  expenses: Expense[];
  tasks: RoutineTask[];
};

type DashboardTab = "expense" | "category" | "routine" | "recent" | "reminders";

const dashboardTabs: Array<{ id: DashboardTab; label: string }> = [
  { id: "expense", label: "Expense Overview" },
  { id: "category", label: "Category Distribution" },
  { id: "routine", label: "Today's Routine" },
  { id: "recent", label: "Recent Expenses" },
  { id: "reminders", label: "Reminders" },
];

const quickActions = [
  { label: "Add Expense", href: "/expenses", icon: Plus, tone: "emerald" },
  { label: "Add Task", href: "/routine", icon: CheckCircle2, tone: "blue" },
  { label: "Scan Slip", href: "/receipt-scanner", icon: Camera, tone: "blue" },
  { label: "Start Timer", href: "/timer", icon: Clock3, tone: "blue" },
] as const;

function EmptyState({ children }: { children: string }) {
  return <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">{children}</p>;
}

function getWeekSpend(expenses: Expense[]) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - 6 + index);
    const key = date.toISOString().slice(0, 10);
    return {
      day: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date),
      value: getTotalSpent(expenses.filter((expense) => expense.date === key)),
    };
  });
}

function ExpenseOverview({ expenses }: { expenses: Expense[] }) {
  const points = getWeekSpend(expenses);
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const weeklyTotal = points.reduce((total, point) => total + point.value, 0);

  return (
    <SharedCard>
      <SharedCardHeader title="Expense Overview (Last 7 Days)" />
      {expenses.length === 0 ? (
        <EmptyState>Add an expense to see your spending overview.</EmptyState>
      ) : (
        <div className="grid h-64 grid-cols-7 items-end gap-3 border-b border-slate-200 px-2 pt-8">
          {points.map((point) => (
            <div className="flex h-full min-w-0 flex-col justify-end gap-2" key={point.day}>
              <span className="truncate text-center font-mono text-xs font-semibold text-slate-600" title={formatCurrency(point.value)}>
                {point.value ? formatCurrency(point.value) : "—"}
              </span>
              <span className="min-h-1 rounded-t bg-emerald-500" style={{ height: `${Math.max((point.value / maxValue) * 100, point.value ? 3 : 1)}%` }} />
              <span className="pb-3 text-center text-xs font-semibold text-slate-500">{point.day}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Last 7 days</p>
          <p className="mt-2 font-mono text-3xl font-semibold text-slate-950">{formatCurrency(weeklyTotal)}</p>
        </div>
        <Link className="text-sm font-semibold text-emerald-600 hover:text-emerald-700" href="/expenses">View expenses</Link>
      </div>
    </SharedCard>
  );
}

function CategoryDistribution({ categories, expenses }: { categories: BudgetCategory[]; expenses: Expense[] }) {
  const rows = categories.map((category) => ({
    ...category,
    spent: getCategorySpent(expenses, category.name),
  }));
  const totalSpent = getTotalSpent(expenses);

  return (
    <SharedCard>
      <SharedCardHeader title="Category Distribution" />
      {rows.length === 0 ? (
        <EmptyState>Create a budget category to track its spending here.</EmptyState>
      ) : (
        <div className="space-y-5">
          {rows.map((row) => {
            const percent = totalSpent > 0 ? Math.round((row.spent / totalSpent) * 100) : 0;
            return (
              <div key={row.id}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm font-semibold">
                  <span className="truncate text-slate-800">{row.name}</span>
                  <span className="shrink-0 font-mono text-slate-600">{formatCurrency(row.spent)} · {percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Link className="mt-8 flex min-h-12 items-center justify-center gap-2 border border-slate-200 text-sm font-semibold text-slate-800 hover:border-emerald-500/40 hover:text-emerald-600" href="/budget">
        Manage budget <ExternalLink aria-hidden="true" className="size-4" />
      </Link>
    </SharedCard>
  );
}

function RoutineTimeline({ tasks }: { tasks: RoutineTask[] }) {
  const sortedTasks = [...tasks].sort((a, b) => a.plannedStart.localeCompare(b.plannedStart));
  return (
    <SharedCard>
      <SharedCardHeader title="Today's Routine" />
      {sortedTasks.length === 0 ? <EmptyState>Add a task to build your routine.</EmptyState> : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <div className="grid grid-cols-[74px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3" key={task.id}>
              <span className="font-mono text-sm font-semibold text-slate-500">{task.plannedStart}</span>
              <span className="truncate font-semibold text-slate-950">{task.title}</span>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", task.status === "completed" ? "bg-emerald-50 text-emerald-600" : task.status === "active" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600")}>{task.status}</span>
            </div>
          ))}
        </div>
      )}
    </SharedCard>
  );
}

function RecentExpenses({ expenses }: { expenses: Expense[] }) {
  const rows = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return (
    <SharedCard>
      <SharedCardHeader title="Recent Expenses" />
      {rows.length === 0 ? <EmptyState>Your saved expenses will appear here.</EmptyState> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead><tr className="border-y border-slate-200 bg-slate-50 text-left font-semibold text-slate-500"><th className="px-3 py-3">Item</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Date</th><th className="px-3 py-3 text-right">Amount</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{rows.map((expense) => <tr key={expense.id}><td className="px-3 py-4 font-semibold text-slate-950">{expense.itemName}</td><td className="px-3 py-4 text-slate-700">{expense.category}</td><td className="px-3 py-4 text-slate-600">{expense.date}</td><td className="px-3 py-4 text-right font-mono font-semibold text-slate-950">{formatCurrency(expense.amount)}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </SharedCard>
  );
}

function UpcomingReminders({ tasks }: { tasks: RoutineTask[] }) {
  const reminders = tasks.filter((task) => task.alertEnabled && task.reminderAt).sort((a, b) => (a.reminderAt ?? "").localeCompare(b.reminderAt ?? ""));
  return (
    <SharedCard>
      <SharedCardHeader title="Upcoming Reminders" />
      {reminders.length === 0 ? <EmptyState>Enable a task reminder to see it here.</EmptyState> : (
        <div className="space-y-3">{reminders.map((task) => <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3" key={task.id}><div className="min-w-0"><p className="truncate font-semibold text-slate-950">{task.title}</p><p className="mt-1 text-sm text-slate-500">{task.category}</p></div><span className="shrink-0 font-mono text-sm font-semibold text-emerald-600">{task.reminderAt}</span></div>)}</div>
      )}
    </SharedCard>
  );
}

function TaskSummary({ tasks }: { tasks: RoutineTask[] }) {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const active = tasks.filter((task) => task.status === "active").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const missed = tasks.filter((task) => task.status === "missed" || task.status === "delayed").length;
  const progress = getRoutineProgress(tasks);
  const nextTasks = [...tasks].filter((task) => task.status !== "completed").sort((a, b) => a.plannedStart.localeCompare(b.plannedStart)).slice(0, 3);
  const stats = [{ label: "Completed", value: completed, icon: CheckCircle2, tone: "text-green-500 bg-green-50" }, { label: "Active", value: active, icon: Clock3, tone: "text-blue-500 bg-blue-50" }, { label: "Pending", value: pending, icon: Circle, tone: "text-amber-500 bg-amber-50" }, { label: "Missed", value: missed, icon: XCircle, tone: "text-red-500 bg-red-50" }];

  return <SharedCard><SharedCardHeader title="Today's Tasks" />
    {tasks.length === 0 ? <EmptyState>Add a task to begin planning your day.</EmptyState> : <><div className="flex flex-wrap gap-2">{stats.map((stat) => <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700" key={stat.label}><span className={cn("flex size-5 items-center justify-center rounded-full", stat.tone)}><stat.icon aria-hidden="true" className="size-3" /></span>{stat.label}<span className="font-mono text-sm text-slate-950">{stat.value}</span></span>)}</div>
      <div className="mt-6 rounded-2xl bg-slate-50 p-4"><div className="mb-3 flex items-end justify-between"><div><p className="text-sm font-semibold text-slate-950">Completion Progress</p><p className="mt-1 text-xs font-medium text-slate-500">{tasks.length} tracked task{tasks.length === 1 ? "" : "s"}</p></div><span className="font-mono text-2xl font-semibold text-emerald-600">{progress}%</span></div><div className="h-2 rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} /></div></div>
      <div className="mt-4 space-y-2">{nextTasks.map((task) => <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3" key={task.id}><span className="truncate text-sm font-semibold text-slate-800">{task.title}</span><span className="font-mono text-xs font-semibold text-slate-500">{task.plannedStart}</span></div>)}</div></>}
  </SharedCard>;
}

function QuickAddPanel() {
  return <SharedCard><SharedCardHeader title="Quick Add" /><div className="grid gap-3">{quickActions.map((action) => <Link className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-emerald-500/40 hover:text-emerald-600" href={action.href} key={action.href}><span className={cn("flex size-7 items-center justify-center rounded-lg", action.tone === "emerald" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500")}><action.icon aria-hidden="true" className="size-4" /></span>{action.label}</Link>)}</div></SharedCard>;
}

function DashboardTabPanel({ categories, expenses, tasks }: OverviewDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("expense");
  return <section className="min-w-0"><div className="border border-b-0 border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><div className="grid grid-cols-5">{dashboardTabs.map((tab) => <button aria-pressed={activeTab === tab.id} className={cn("min-h-14 min-w-0 truncate px-2 text-xs font-semibold transition sm:px-4 sm:text-sm", activeTab === tab.id ? "bg-emerald-500 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950")} key={tab.id} onClick={() => setActiveTab(tab.id)} type="button">{tab.label}</button>)}</div></div>
    {activeTab === "expense" && <ExpenseOverview expenses={expenses} />}
    {activeTab === "category" && <CategoryDistribution categories={categories} expenses={expenses} />}
    {activeTab === "routine" && <RoutineTimeline tasks={tasks} />}
    {activeTab === "recent" && <RecentExpenses expenses={expenses} />}
    {activeTab === "reminders" && <UpcomingReminders tasks={tasks} />}
  </section>;
}

export function OverviewDashboard({ categories, expenses, tasks }: OverviewDashboardProps) {
  const totalBudget = categories.reduce((total, category) => total + category.monthlyLimit, 0);
  const totalSpent = getTotalSpent(expenses);
  const remainingBudget = totalBudget - totalSpent;
  const todayKey = new Date().toISOString().slice(0, 10);
  const todaySpent = getTotalSpent(expenses.filter((expense) => expense.date === todayKey));
  const budgetProgress = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());

  return <section className="min-w-0 space-y-6 overflow-x-hidden" id="dashboard">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-semibold text-slate-950">Welcome back</h1><p className="mt-2 text-sm font-medium text-slate-500">{dateLabel}</p></div><Link className="text-sm font-semibold text-emerald-600 hover:text-emerald-700" href="/settings">Complete your profile</Link></div>
    <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-4"><StatCard detail={`of ${formatCurrency(totalBudget)}`} icon={WalletCards} label="Monthly Budget" progress={budgetProgress} tone="emerald" value={formatCurrency(totalBudget)} /><StatCard detail="saved today" icon={CreditCard} label="Today's Expense" progress={totalBudget > 0 ? Math.min(Math.round((todaySpent / totalBudget) * 100), 100) : 0} tone="red" value={formatCurrency(todaySpent)} /><StatCard detail={remainingBudget < 0 ? "over budget" : "available to spend"} icon={WalletCards} label="Remaining Budget" progress={totalBudget > 0 ? Math.max(100 - budgetProgress, 0) : 0} tone="blue" value={formatCurrency(Math.max(remainingBudget, 0))} /><StatCard detail={`${budgetProgress}% used`} icon={PiggyBank} label="Budget Usage" progress={budgetProgress} tone="amber" value={formatCurrency(totalSpent)} /></div>
    <DashboardTabPanel categories={categories} expenses={expenses} tasks={tasks} />
    <div className="grid min-w-0 gap-5 xl:grid-cols-[7fr_3fr]"><TaskSummary tasks={tasks} /><QuickAddPanel /></div>
  </section>;
}
