"use client";

import { CalendarDays, ChevronLeft, ChevronRight, ListChecks, ReceiptText } from "lucide-react";
import { useMemo, useState } from "react";
import { SharedCard, StatCard } from "@/components/shared/card";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { cn, formatCurrency } from "@/lib/utils";

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
  tone: "expense" | "task" | "budget";
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function formatReadableDate(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00`));
}

function getCalendarDays(viewDate: Date) {
  const monthStart = startOfMonth(viewDate);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function eventToneClasses(tone: CalendarEvent["tone"]) {
  if (tone === "expense") {
    return "border-red-100 bg-red-50 text-red-600";
  }

  if (tone === "task") {
    return "border-blue-100 bg-blue-50 text-blue-600";
  }

  return "border-emerald-100 bg-emerald-50 text-emerald-600";
}

export default function CalendarPage() {
  const { categories, expenses, tasks } = useLifeOs();
  const todayKey = formatDateKey(new Date());
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const calendarDays = useMemo(() => getCalendarDays(viewDate), [viewDate]);
  const events = useMemo<CalendarEvent[]>(() => {
    const expenseEvents = expenses.map((expense) => ({
      id: `expense-${expense.id}`,
      date: expense.date,
      title: expense.itemName,
      detail: `${expense.category} - ${formatCurrency(expense.amount)}`,
      tone: "expense" as const,
    }));

    const taskEvents = tasks.map((task) => ({
      id: `task-${task.id}`,
      date: todayKey,
      title: task.title,
      detail: `${task.plannedStart} - ${task.plannedEnd}`,
      tone: "task" as const,
    }));

    const budgetEvents = categories.flatMap((category) => {
      const items: CalendarEvent[] = [];

      if (category.startDate) {
        items.push({
          id: `budget-start-${category.id}`,
          date: category.startDate,
          title: `${category.name} starts`,
          detail: formatCurrency(category.monthlyLimit),
          tone: "budget",
        });
      }

      if (category.endDate) {
        items.push({
          id: `budget-end-${category.id}`,
          date: category.endDate,
          title: `${category.name} ends`,
          detail: formatCurrency(category.monthlyLimit),
          tone: "budget",
        });
      }

      return items;
    });

    return [...expenseEvents, ...taskEvents, ...budgetEvents];
  }, [categories, expenses, tasks, todayKey]);

  const eventsByDate = useMemo(() => {
    return events.reduce<Record<string, CalendarEvent[]>>((grouped, event) => {
      grouped[event.date] = [...(grouped[event.date] ?? []), event];
      return grouped;
    }, {});
  }, [events]);

  const selectedEvents = eventsByDate[selectedDate] ?? [];
  const monthExpenseTotal = expenses
    .filter((expense) => {
      const date = new Date(`${expense.date}T00:00:00`);
      return date.getFullYear() === viewDate.getFullYear() && date.getMonth() === viewDate.getMonth();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  function moveMonth(offset: number) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function goToday() {
    const today = new Date();
    setViewDate(startOfMonth(today));
    setSelectedDate(formatDateKey(today));
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeader
          eyebrow="Calendar"
          title="Full calendar view"
          description="Review expenses, routine tasks, and budget date ranges in one monthly calendar."
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            icon={<ChevronLeft aria-hidden="true" className="size-4" />}
            onClick={() => moveMonth(-1)}
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <Button onClick={goToday} type="button" variant="outline">
            Today
          </Button>
          <Button
            icon={<ChevronRight aria-hidden="true" className="size-4" />}
            onClick={() => moveMonth(1)}
            type="button"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          detail="Current view"
          icon={CalendarDays}
          label="Month"
          progress={100}
          tone="emerald"
          value={formatMonthTitle(viewDate)}
        />
        <StatCard
          detail="Expenses this month"
          icon={ReceiptText}
          label="Month expenses"
          progress={monthExpenseTotal > 0 ? 100 : 0}
          tone="red"
          value={formatCurrency(monthExpenseTotal)}
        />
        <StatCard
          detail="Calendar items"
          icon={ListChecks}
          label="Events"
          progress={events.length > 0 ? 100 : 0}
          tone="blue"
          value={String(events.length)}
        />
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SharedCard className="!p-0">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-600">Month view</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-950">{formatMonthTitle(viewDate)}</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-red-500" />
                Expense
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-blue-500" />
                Task
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500" />
                Budget
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {weekDays.map((day) => (
              <div className="px-2 py-3 text-center text-xs font-semibold uppercase text-slate-500" key={day}>
                {day}
              </div>
            ))}
          </div>

          <div className="grid min-h-[720px] grid-cols-7 auto-rows-fr">
            {calendarDays.map((date) => {
              const dateKey = formatDateKey(date);
              const dayEvents = eventsByDate[dateKey] ?? [];
              const isCurrentMonth = date.getMonth() === viewDate.getMonth();
              const isToday = dateKey === todayKey;
              const isSelected = dateKey === selectedDate;

              return (
                <button
                  className={cn(
                    "min-h-28 border-b border-r border-slate-200 bg-white p-2 text-left transition hover:bg-slate-50",
                    !isCurrentMonth && "bg-slate-50/70 text-slate-400",
                    isSelected && "bg-emerald-50/70 ring-2 ring-inset ring-emerald-500",
                  )}
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  type="button"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full text-sm font-semibold",
                        isToday ? "bg-emerald-600 text-white" : "text-slate-700",
                        !isCurrentMonth && !isToday && "text-slate-400",
                      )}
                    >
                      {date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        className={cn("truncate rounded border px-2 py-1 text-xs font-medium", eventToneClasses(event.tone))}
                        key={event.id}
                        title={`${event.title} - ${event.detail}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs font-medium text-slate-400">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </SharedCard>

        <SharedCard className="!p-0">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase text-emerald-600">Selected day</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">{formatReadableDate(selectedDate)}</h2>
          </div>
          <div className="space-y-3 p-5">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <div className={cn("rounded-md border p-3", eventToneClasses(event.tone))} key={event.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{event.title}</p>
                      <p className="mt-1 text-xs opacity-80">{event.detail}</p>
                    </div>
                    <Badge tone={event.tone === "expense" ? "danger" : event.tone === "task" ? "indigo" : "success"}>
                      {event.tone}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-slate-200 p-6 text-center">
                <p className="text-sm font-semibold text-slate-700">No items on this date</p>
                <p className="mt-1 text-sm text-slate-500">Expenses, tasks, and budget dates will appear here.</p>
              </div>
            )}
          </div>
        </SharedCard>
      </div>
    </div>
  );
}
