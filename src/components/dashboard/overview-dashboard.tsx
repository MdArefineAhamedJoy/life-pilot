"use client";

import Link from "next/link";
import {
  Bell,
  Camera,
  Car,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  CreditCard,
  ExternalLink,
  MoreVertical,
  PiggyBank,
  Plus,
  Search,
  Sun,
  WalletCards,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  SharedCard,
  SharedCardButton,
  SharedCardHeader,
  StatCard,
} from "@/components/shared/card";
import type { BudgetCategory, Expense, RoutineTask } from "@/lib/types";
import { getRoutineProgress, getTotalSpent } from "@/lib/calculations";
import { cn, formatCurrency } from "@/lib/utils";

type OverviewDashboardProps = {
  categories: BudgetCategory[];
  expenses: Expense[];
  tasks: RoutineTask[];
};

const weekPoints = [
  { day: "Mon", value: 14 },
  { day: "Tue", value: 34 },
  { day: "Wed", value: 28 },
  { day: "Thu", value: 68 },
  { day: "Fri", value: 48 },
  { day: "Sat", value: 34 },
  { day: "Sun", value: 82 },
];

const routineSlots = [
  { time: "07:00 AM", title: "Morning Walk", status: "Done", tone: "success" },
  { time: "08:00 AM", title: "Breakfast & Prayer", status: "Done", tone: "success" },
  { time: "09:00 AM", title: "Office Work", status: "In Progress", tone: "info" },
  { time: "01:00 PM", title: "Lunch Break", status: "Upcoming", tone: "warning" },
  { time: "05:00 PM", title: "Learning Time", status: "Pending", tone: "neutral" },
  { time: "08:00 PM", title: "Family Time", status: "Pending", tone: "neutral" },
  { time: "10:00 PM", title: "Sleep", status: "Pending", tone: "neutral" },
];

const categoryRows = [
  { label: "Kacha Bajar", value: "40%", color: "bg-emerald-500" },
  { label: "Modi Bajar", value: "25%", color: "bg-blue-500" },
  { label: "Transport", value: "15%", color: "bg-amber-500" },
  { label: "Bills", value: "10%", color: "bg-violet-500" },
  { label: "Others", value: "10%", color: "bg-slate-400" },
];

const quickActions = [
  { label: "Add Expense", href: "/expenses", icon: Plus, tone: "emerald" },
  { label: "Add Task", href: "/routine", icon: CheckCircle2, tone: "blue" },
  { label: "Scan Slip", href: "/receipt-scanner", icon: Camera, tone: "blue" },
  { label: "Start Timer", href: "/timer", icon: Clock3, tone: "blue" },
] as const;

type DashboardTab = "expense" | "category" | "routine" | "recent" | "reminders";

const defaultDashboardTab: DashboardTab = "expense";

const dashboardTabs: Array<{ id: DashboardTab; label: string }> = [
  { id: "expense", label: "Expense Overview" },
  { id: "category", label: "Category Distribution" },
  { id: "routine", label: "Today's Routine" },
  { id: "recent", label: "Recent Expenses" },
  { id: "reminders", label: "Reminders" },
];

function ExpenseOverview({ totalSpent }: { totalSpent: number }) {
  return (
    <SharedCard>
      <SharedCardHeader
        title="Expense Overview (This Week)"
        action={
          <SharedCardButton>
            This Week
            <ChevronDown aria-hidden="true" className="size-3.5" />
          </SharedCardButton>
        }
      />
      <div className="relative h-[320px]">
        <div className="absolute left-0 top-2 flex h-[242px] flex-col justify-between text-sm font-semibold text-slate-500">
          <span>2K</span>
          <span>1.5K</span>
          <span>1K</span>
          <span>500</span>
          <span>0</span>
        </div>
        <svg
          className="absolute left-12 right-0 top-5 h-[254px] w-[calc(100%-3rem)] overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 700 240"
        >
          <defs>
            <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          {[0, 60, 120, 180, 240].map((y) => (
            <line key={y} stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1={y} y2={y} />
          ))}
          <path d="M0 208 L112 164 L224 178 L336 164 L448 76 L560 126 L700 30 L700 240 L0 240 Z" fill="url(#expenseFill)" />
          <path
            d="M0 208 C38 198 74 174 112 164 C150 154 186 175 224 178 C262 181 298 170 336 164 C374 148 410 100 448 76 C486 90 522 112 560 126 C604 146 656 62 700 30"
            fill="none"
            stroke="#16A34A"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
        <div className="pointer-events-none absolute left-12 right-0 top-5 h-[254px]">
          {[
            [0, 86.7],
            [16, 68.3],
            [32, 74.2],
            [48, 68.3],
            [64, 31.7],
            [80, 52.5],
            [100, 12.5],
          ].map(([left, top]) => (
            <span
              className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-emerald-500 bg-white"
              key={`${left}-${top}`}
              style={{ left: `${left}%`, top: `${top}%` }}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-12 right-0 flex justify-between border-t border-slate-200 pt-4 text-sm font-semibold text-slate-500">
          {weekPoints.map((point) => (
            <span key={point.day}>{point.day}</span>
          ))}
        </div>
      </div>
      <div className="mt-7 border-t border-slate-200 pt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">Total Expense</p>
          <p className="mt-3 font-mono text-3xl font-semibold text-slate-950">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-emerald-600">▲ 12.5%</p>
          <p className="mt-2 text-sm font-medium text-slate-500">vs last week</p>
        </div>
      </div>
    </SharedCard>
  );
}

function CategoryDistribution({ totalSpent }: { totalSpent: number }) {
  return (
    <SharedCard>
      <SharedCardHeader title="Category Distribution" />
      <div className="grid items-center gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="relative mx-auto size-72 rounded-full bg-[conic-gradient(#10b981_0_40%,#3b82f6_40%_65%,#f97316_65%_80%,#8b5cf6_80%_90%,#94a3b8_90%_100%)]">
          <div className="absolute inset-[76px] flex flex-col items-center justify-center rounded-full bg-white px-2 text-center">
            <span className="max-w-full truncate font-mono text-2xl font-semibold text-slate-950">{formatCurrency(totalSpent)}</span>
            <span className="mt-1 text-sm font-medium text-slate-500">Total</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="space-y-5">
            {categoryRows.map((row) => (
              <div className="flex items-center gap-4 text-lg" key={row.label}>
                <span className={cn("size-3.5 rounded-full", row.color)} />
                <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">{row.label}</span>
                <span className="font-semibold text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>
          <Link
            className="mt-10 flex min-h-14 max-w-sm items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-base font-semibold text-slate-800 transition hover:border-emerald-500/40 hover:text-emerald-600"
            href="/reports"
          >
            View Full Report
            <ExternalLink aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </div>
    </SharedCard>
  );
}

function RoutineTimeline({ tasks }: { tasks: RoutineTask[] }) {
  const taskTitles = new Set(tasks.map((task) => task.title));

  return (
    <SharedCard>
      <SharedCardHeader title="Today's Routine" action={<SharedCardButton>View All</SharedCardButton>} />
      <div className="space-y-4">
        {routineSlots.map((slot, index) => {
          const isKnownTask = taskTitles.has(slot.title);
          return (
            <div className="relative grid grid-cols-[82px_18px_minmax(0,1fr)] items-center gap-5" key={slot.time}>
              <span className="text-sm font-semibold text-slate-500">{slot.time}</span>
              <span className="relative flex h-full min-h-12 items-center justify-center">
                {index > 0 && (
                  <span className="absolute bottom-1/2 left-1/2 top-[-16px] w-[2px] -translate-x-1/2 bg-slate-300" />
                )}
                {index < routineSlots.length - 1 && (
                  <span className="absolute bottom-[-16px] left-1/2 top-1/2 w-[2px] -translate-x-1/2 bg-slate-300" />
                )}
                <span
                  className={cn(
                    "relative z-10 size-4 rounded-full border-2 border-white shadow-[0_0_0_3px_rgba(226,232,240,0.85)]",
                    slot.tone === "success" && "bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.16)]",
                    slot.tone === "info" && "bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.16)]",
                    slot.tone === "warning" && "bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.18)]",
                    slot.tone === "neutral" && "bg-slate-400 shadow-[0_0_0_3px_rgba(148,163,184,0.18)]",
                  )}
                />
              </span>
              <div className="flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <span className="truncate text-base font-semibold text-slate-950">
                  {isKnownTask ? slot.title : slot.title}
                </span>
                {slot.tone === "success" ? (
                  <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-green-500" />
                ) : (
                  <span
                    className={cn(
                      "rounded-lg px-3 py-1 text-sm font-semibold",
                      slot.tone === "info" && "bg-blue-50 text-blue-500",
                      slot.tone === "warning" && "bg-amber-50 text-amber-600",
                      slot.tone === "neutral" && "bg-slate-100 text-slate-500",
                    )}
                  >
                    {slot.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SharedCard>
  );
}

function RecentExpenses() {
  const rows = [
    { item: "Milk", category: "Kacha Bajar", amount: 60, payment: "Cash", time: "08:15 AM", icon: WalletCards, tone: "bg-emerald-50 text-emerald-500" },
    { item: "Chicken", category: "Kacha Bajar", amount: 250, payment: "bKash", time: "11:30 AM", icon: Zap, tone: "bg-red-50 text-red-500" },
    { item: "Rickshaw", category: "Transport", amount: 40, payment: "Cash", time: "01:20 PM", icon: Car, tone: "bg-blue-50 text-blue-500" },
    { item: "Electricity Bill", category: "Bills", amount: 1200, payment: "Nagad", time: "03:45 PM", icon: Bell, tone: "bg-amber-50 text-amber-500" },
    { item: "Medicine", category: "Medical", amount: 180, payment: "bKash", time: "07:10 PM", icon: PiggyBank, tone: "bg-violet-50 text-violet-500" },
  ];

  return (
    <SharedCard>
      <SharedCardHeader title="Recent Expenses" action={<SharedCardButton>View All</SharedCardButton>} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-left text-sm font-semibold text-slate-500">
              <th className="px-3 py-3">Item</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Amount</th>
              <th className="px-3 py-3">Payment</th>
              <th className="px-3 py-3">Time</th>
              <th className="px-3 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((expense) => {
              const Icon = expense.icon;
              return (
                <tr key={expense.item}>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <span className={cn("flex size-9 items-center justify-center rounded-xl", expense.tone)}>
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <span className="font-semibold text-slate-950">{expense.item}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 font-semibold text-slate-700">{expense.category}</td>
                  <td className="px-3 py-4 font-mono font-semibold text-slate-950">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-3 py-4 font-semibold text-slate-700">{expense.payment}</td>
                  <td className="px-3 py-4 font-semibold text-slate-600">{expense.time}</td>
                  <td className="px-3 py-4 text-right">
                    <MoreVertical aria-hidden="true" className="ml-auto size-4 text-slate-500" />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200">
              <td className="px-3 py-4 text-base font-semibold text-slate-950" colSpan={2}>
                Total:
              </td>
              <td className="px-3 py-5 font-mono text-xl font-semibold text-slate-950">
                {formatCurrency(rows.reduce((sum, row) => sum + row.amount, 0))}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>
    </SharedCard>
  );
}

function UpcomingReminders() {
  const reminders = [
    { title: "Electricity Bill", detail: "Due Tomorrow, 10:00 AM", amount: 1200, icon: WalletCards, tone: "bg-emerald-50 text-emerald-500" },
    { title: "Doctor Appointment", detail: "18 May, 10:30 AM", icon: Zap, tone: "bg-red-50 text-red-500" },
    { title: "Internet Bill", detail: "20 May, 11:59 PM", amount: 800, icon: CreditCard, tone: "bg-blue-50 text-blue-500" },
    { title: "School Fee", detail: "25 May, 11:59 PM", amount: 2500, icon: Bell, tone: "bg-amber-50 text-amber-500" },
  ];

  return (
    <SharedCard>
      <SharedCardHeader title="Upcoming Reminders" action={<SharedCardButton>View All</SharedCardButton>} />
      <div className="space-y-4">
        {reminders.map((reminder) => {
          const Icon = reminder.icon;
          return (
            <div className="flex min-h-20 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm" key={reminder.title}>
              <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", reminder.tone)}>
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-slate-950">{reminder.title}</p>
                <p className="mt-1 truncate text-sm font-medium text-slate-500">{reminder.detail}</p>
              </div>
              {typeof reminder.amount === "number" && (
                <span className="font-mono text-sm font-semibold text-slate-950">{formatCurrency(reminder.amount)}</span>
              )}
            </div>
          );
        })}
      </div>
    </SharedCard>
  );
}

function TaskSummary({ routineProgress, missedCount }: { routineProgress: number; missedCount: number }) {
  const stats = [
    { label: "Completed", value: 3, icon: CheckCircle2, tone: "text-green-500 bg-green-50" },
    { label: "In Progress", value: 2, icon: Clock3, tone: "text-blue-500 bg-blue-50" },
    { label: "Pending", value: 2, icon: Circle, tone: "text-amber-500 bg-amber-50" },
    { label: "Missed", value: missedCount, icon: XCircle, tone: "text-red-500 bg-red-50" },
  ];
  const nextTasks = [
    { title: "Office Work", meta: "Now active", tone: "bg-blue-50 text-blue-500" },
    { title: "Lunch Break", meta: "01:00 PM", tone: "bg-amber-50 text-amber-600" },
    { title: "Learning Time", meta: "05:00 PM", tone: "bg-slate-100 text-slate-500" },
  ];

  return (
    <SharedCard>
      <SharedCardHeader title="Today's Tasks" action={<SharedCardButton>View All</SharedCardButton>} />
      <div className="flex flex-wrap gap-2">
        {stats.map((stat) => (
          <span
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
            key={stat.label}
          >
            <span className={cn("flex size-5 items-center justify-center rounded-full", stat.tone)}>
              <stat.icon aria-hidden="true" className="size-3" />
            </span>
            {stat.label}
            <span className="font-mono text-sm text-slate-950">{stat.value}</span>
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">Completion Progress</p>
            <p className="mt-1 text-xs font-medium text-slate-500">7 tracked tasks today</p>
          </div>
          <span className="font-mono text-2xl font-semibold text-emerald-600">{routineProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${routineProgress}%` }} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {nextTasks.map((task) => (
          <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3" key={task.title}>
            <span className="truncate text-sm font-semibold text-slate-800">{task.title}</span>
            <span className={cn("shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold", task.tone)}>{task.meta}</span>
          </div>
        ))}
      </div>
    </SharedCard>
  );
}

function QuickAddPanel() {
  return (
    <SharedCard>
      <SharedCardHeader title="Quick Add" />
      <div className="grid gap-3">
        {quickActions.map((action) => (
          <Link
            className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-emerald-500/40 hover:text-emerald-600"
            href={action.href}
            key={action.href}
          >
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-lg",
                action.tone === "emerald" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500",
              )}
            >
              <action.icon aria-hidden="true" className="size-4" />
            </span>
            {action.label}
          </Link>
        ))}
      </div>
    </SharedCard>
  );
}

function DashboardTabPanel({
  totalSpent,
  tasks,
}: {
  totalSpent: number;
  tasks: RoutineTask[];
}) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(defaultDashboardTab);

  return (
    <section className="min-w-0">
      <div className="border border-b-0 border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="grid grid-cols-5">
          {dashboardTabs.map((tab) => (
            <button
              aria-pressed={activeTab === tab.id}
              className={cn(
                "min-h-14 min-w-0 truncate px-4 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "bg-emerald-500 text-white shadow-[0_8px_18px_rgba(16,185,129,0.24)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === "expense" && <ExpenseOverview totalSpent={totalSpent} />}
        {activeTab === "category" && <CategoryDistribution totalSpent={totalSpent} />}
        {activeTab === "routine" && <RoutineTimeline tasks={tasks} />}
        {activeTab === "recent" && <RecentExpenses />}
        {activeTab === "reminders" && <UpcomingReminders />}
      </div>
    </section>
  );
}

export function OverviewDashboard({ categories, expenses, tasks }: OverviewDashboardProps) {
  const totalBudget = categories.reduce((total, category) => total + category.monthlyLimit, 0);
  const totalSpent = getTotalSpent(expenses);
  const remainingBudget = Math.max(totalBudget - totalSpent, 0);
  const todaySpent = getTotalSpent(expenses.filter((expense) => expense.date === "2026-08-05"));
  const monthlySavings = Math.max(Math.round(totalBudget * 0.25), 0);
  const budgetProgress = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const routineProgress = getRoutineProgress(tasks);
  const missedCount = tasks.filter((task) => task.status === "missed" || task.status === "delayed").length;

  return (
    <section className="min-w-0 space-y-6 overflow-x-hidden" id="dashboard">
      <div className="grid gap-4 xl:grid-cols-[minmax(320px,1fr)_minmax(260px,380px)_minmax(120px,1fr)] xl:items-start">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-slate-950">Good Morning, Joy!</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Thursday, 06 August 2026</p>
        </div>
        <label className="relative block xl:col-start-2">
          <Search aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            className="h-11 w-full border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Search anything..."
            type="search"
          />
        </label>
        <div className="flex items-center gap-3 xl:justify-end">
          <button className="relative flex size-10 items-center justify-center text-slate-800" type="button">
            <Bell aria-hidden="true" className="size-6" strokeWidth={1.8} />
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold leading-none text-white">
              3
            </span>
          </button>
          <button className="flex size-10 items-center justify-center text-slate-800" type="button">
            <Sun aria-hidden="true" className="size-6" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail={`of ${formatCurrency(totalBudget)}`}
          icon={WalletCards}
          label="Today's Budget"
          progress={Math.max(100 - budgetProgress, 10)}
          tone="emerald"
          value={formatCurrency(totalBudget / 30)}
        />
        <StatCard
          detail={`${budgetProgress}% of budget`}
          icon={CreditCard}
          label="Today's Expense"
          progress={budgetProgress}
          tone="red"
          value={formatCurrency(todaySpent || totalSpent)}
        />
        <StatCard
          detail={`${100 - budgetProgress}% left`}
          icon={WalletCards}
          label="Remaining Budget"
          progress={Math.max(100 - budgetProgress, 0)}
          tone="blue"
          value={formatCurrency(remainingBudget)}
        />
        <StatCard
          detail={`of ${formatCurrency(totalBudget)}`}
          icon={PiggyBank}
          label="Monthly Savings"
          progress={Math.min(Math.round((monthlySavings / totalBudget) * 100), 100)}
          tone="emerald"
          value={formatCurrency(monthlySavings)}
        />
      </div>

      <DashboardTabPanel
        tasks={tasks}
        totalSpent={totalSpent}
      />

      <div className="grid min-w-0 gap-5 xl:grid-cols-[7fr_3fr]">
        <TaskSummary missedCount={missedCount || 1} routineProgress={routineProgress || 60} />
        <QuickAddPanel />
      </div>
    </section>
  );
}
