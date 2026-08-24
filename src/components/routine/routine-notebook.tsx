"use client";

import { ArrowDown, ArrowUp, Bell, BellOff, BookOpen, CheckCircle2, Circle, Clock, Pause, Play, SkipForward, TimerReset, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  getRoutineAlertTime,
  getRoutineDisplayStatus,
  getRoutineDuration,
  getRoutineStatusTone,
  getRoutineTaskOrder,
  isTaskInRoutineWindow,
  routineStatusLabels,
  routineWindows,
  type RoutineWindow,
} from "@/components/routine/routine-utils";
import type { RoutineTask } from "@/lib/types";
import { cn, formatMinutes } from "@/lib/utils";

type RoutineNotebookProps = {
  currentTaskId?: string;
  onCompleteTask: (taskId: string) => void;
  onDelayTask: (task: RoutineTask) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, direction: "up" | "down") => void;
  onSkipTask: (taskId: string) => void;
  onStartTask: (task: RoutineTask) => void;
  onToggleAlert: (task: RoutineTask) => void;
  orderedTasks: RoutineTask[];
  progress: number;
  routineWindow: RoutineWindow;
  setRoutineWindow: (windowId: RoutineWindow) => void;
  visibleTasks: RoutineTask[];
};

export function RoutineNotebook({
  currentTaskId,
  onCompleteTask,
  onDelayTask,
  onDeleteTask,
  onMoveTask,
  onSkipTask,
  onStartTask,
  onToggleAlert,
  orderedTasks,
  progress,
  routineWindow,
  setRoutineWindow,
  visibleTasks,
}: RoutineNotebookProps) {
  return (
    <section className="min-w-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-emerald-600">Notebook</p>
          <h2 className="mt-1 break-words text-lg font-semibold text-slate-800">Today&apos;s points</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 sm:grid-cols-4 lg:min-w-[520px]">
          {routineWindows.map((windowItem) => {
            const tabCount = orderedTasks.filter((task) => isTaskInRoutineWindow(task, windowItem.id)).length;
            const isActive = routineWindow === windowItem.id;
            const TabIcon = windowItem.Icon;

            return (
              <button
                className={cn(
                  "flex min-h-11 min-w-0 items-center justify-between gap-2 rounded-lg px-3 text-left text-sm font-semibold transition",
                  isActive
                    ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                )}
                key={windowItem.id}
                onClick={() => setRoutineWindow(windowItem.id)}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <TabIcon className={cn("h-4 w-4 shrink-0", isActive ? "text-emerald-600" : "text-slate-400")} />
                  <span className="truncate">{windowItem.label}</span>
                </span>
                <span
                  className={cn(
                    "grid h-6 min-w-6 shrink-0 place-items-center rounded-md px-1.5 text-xs",
                    isActive ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-500",
                  )}
                >
                  {tabCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar label={`${progress}% completed today`} tone="teal" value={progress} />
      </div>

      <div className="mt-5 space-y-3">
        {visibleTasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No routine points in this view yet.
          </div>
        ) : (
          visibleTasks.map((task, index) => {
            const displayStatus = getRoutineDisplayStatus(task);
            const globalIndex = orderedTasks.findIndex((orderedTask) => orderedTask.id === task.id);

            return (
              <article
                className={cn(
                  "min-w-0 rounded-lg border p-3 transition",
                  task.id === currentTaskId ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300",
                )}
                key={task.id}
              >
                <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
                  <div className="flex items-center gap-2 lg:flex-col">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-sm font-semibold text-slate-700 shadow-sm">
                      {String(getRoutineTaskOrder(task, index)).padStart(2, "0")}
                    </span>
                    {displayStatus === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="min-w-0 break-words text-sm font-semibold text-slate-900 sm:text-base">{task.title}</h3>
                      <Badge tone={getRoutineStatusTone(displayStatus)}>{routineStatusLabels[displayStatus]}</Badge>
                      <Badge tone={task.priority === "high" ? "rose" : task.priority === "medium" ? "amber" : "neutral"}>{task.priority}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.plannedStart} - {task.plannedEnd}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <TimerReset className="h-4 w-4" />
                        {formatMinutes(getRoutineDuration(task))}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {task.category}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {task.alertEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        {task.alertEnabled ? `Alert ${getRoutineAlertTime(task)}` : "No alert"}
                      </span>
                    </div>
                    {task.note && <p className="mt-2 break-words text-sm text-slate-500">{task.note}</p>}
                  </div>

                  <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap lg:justify-end">
                    <IconButton disabled={globalIndex === 0} label="Move up" onClick={() => onMoveTask(task.id, "up")}>
                      <ArrowUp className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      disabled={globalIndex === orderedTasks.length - 1}
                      label="Move down"
                      onClick={() => onMoveTask(task.id, "down")}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </IconButton>
                    <IconButton label={task.alertEnabled ? "Disable alert" : "Enable alert"} onClick={() => onToggleAlert(task)}>
                      {task.alertEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </IconButton>
                    <IconButton label="Delete point" onClick={() => onDeleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  <Button className="h-8 px-3 text-xs" icon={<Play className="h-3.5 w-3.5" />} onClick={() => onStartTask(task)} type="button" variant={task.status === "active" ? "secondary" : "outline"}>
                    Start
                  </Button>
                  <Button className="h-8 px-3 text-xs" icon={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => onCompleteTask(task.id)} type="button" variant="primary">
                    Done
                  </Button>
                  <Button className="h-8 px-3 text-xs" icon={<Pause className="h-3.5 w-3.5" />} onClick={() => onDelayTask(task)} type="button" variant="outline">
                    Delay 15m
                  </Button>
                  <Button className="h-8 px-3 text-xs" icon={<SkipForward className="h-3.5 w-3.5" />} onClick={() => onSkipTask(task.id)} type="button" variant="ghost">
                    Skip
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
