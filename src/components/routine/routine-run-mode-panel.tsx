"use client";

import { Bell, BellOff, BookOpen, CalendarDays, CheckCircle2, Pause, Play, SkipForward, TimerReset } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getRoutineAlertTime,
  getRoutineDisplayStatus,
  getRoutineDuration,
  getRoutineStatusTone,
  routineStatusLabels,
} from "@/components/routine/routine-utils";
import type { RoutineTask } from "@/lib/types";
import { formatMinutes } from "@/lib/utils";

type RoutineRunModePanelProps = {
  alertCount: number;
  completedText: string;
  currentTask?: RoutineTask;
  currentTaskPosition: number;
  missedCount: number;
  onComplete: () => void;
  onDelay: () => void;
  onSkip: () => void;
  onStart: () => void;
  progress: number;
  quietHours: string;
  totalTasks: number;
  upcomingTask?: RoutineTask;
};

export function RoutineRunModePanel({
  alertCount,
  completedText,
  currentTask,
  currentTaskPosition,
  missedCount,
  onComplete,
  onDelay,
  onSkip,
  onStart,
  progress,
  quietHours,
  totalTasks,
  upcomingTask,
}: RoutineRunModePanelProps) {
  return (
    <Card className="p-0">
      {currentTask ? (
        <div className="grid gap-2 p-1 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid min-w-0 gap-1 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-4">
            <InfoChip label="Completed" value={completedText} />
            <InfoChip label="Alerts" value={String(alertCount)} />
            <InfoChip label="Missed" value={String(missedCount)} />
            <InfoChip label="Quiet hours" value={quietHours} />
          </div>
          <div className="min-w-0 space-y-2">
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${Math.round((currentTaskPosition / Math.max(totalTasks, 1)) * 100)}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-500">
                <span>Step {currentTaskPosition} in today&apos;s routine</span>
                <span>{progress}% done</span>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-md bg-white px-1 py-1 text-sm font-semibold text-blue-700 shadow-sm">
                  <CalendarDays className="h-4 w-4" />
                  {currentTask.plannedStart} - {currentTask.plannedEnd}
                </span>
                <Badge tone={getRoutineStatusTone(getRoutineDisplayStatus(currentTask))}>
                  {routineStatusLabels[getRoutineDisplayStatus(currentTask)]}
                </Badge>
              </div>
              <h3 className="mt-2 break-words text-2xl font-semibold text-slate-950">{currentTask.title}</h3>
              <div className="mt-2 grid gap-2 text-sm text-slate-600 md:grid-cols-3">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <BookOpen className="h-4 w-4 shrink-0 text-blue-600" />
                  <span className="truncate">{currentTask.category}</span>
                </span>
                <span className="inline-flex min-w-0 items-center gap-2">
                  <TimerReset className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>{formatMinutes(getRoutineDuration(currentTask))} estimate</span>
                </span>
                <span className="inline-flex min-w-0 items-center gap-2">
                  {currentTask.alertEnabled ? (
                    <Bell className="h-4 w-4 shrink-0 text-blue-600" />
                  ) : (
                    <BellOff className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                  <span className="truncate">{currentTask.alertEnabled ? `Alert at ${getRoutineAlertTime(currentTask)}` : "No alert set"}</span>
                </span>
              </div>
            </div>
          </div>

          <aside className="grid min-w-0 content-start gap-2">
            {upcomingTask && (
              <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs font-medium text-slate-500">Next point</p>
                <p className="mt-1 truncate font-semibold text-slate-800">{upcomingTask.title}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{upcomingTask.plannedStart}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button className="h-9 px-2" icon={<Play className="h-4 w-4" />} onClick={onStart} type="button">
                Start
              </Button>
              <Button className="h-9 px-2" icon={<CheckCircle2 className="h-4 w-4" />} onClick={onComplete} type="button" variant="secondary">
                Done next
              </Button>
              <Button className="h-9 px-2" icon={<Pause className="h-4 w-4" />} onClick={onDelay} type="button" variant="outline">
                Delay
              </Button>
              <Button className="h-9 px-2" icon={<SkipForward className="h-4 w-4" />} onClick={onSkip} type="button" variant="ghost">
                Skip next
              </Button>
            </div>
          </aside>
        </div>
      ) : (
        <div className="p-1">
          <div className="rounded-md border border-dashed border-slate-300 p-2 text-sm text-slate-500">
            All routine points are complete or skipped.
          </div>
        </div>
      )}
    </Card>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-9 min-w-0 items-center justify-between gap-1 rounded-md border border-slate-200 bg-white p-1 text-sm shadow-sm">
      <span className="truncate text-slate-500">{label}</span>
      <span className="shrink-0 font-semibold text-slate-950">{value}</span>
    </div>
  );
}
