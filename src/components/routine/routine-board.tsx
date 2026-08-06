"use client";

import type { RoutineStatus, RoutineTask } from "@/lib/types";
import { getRoutineProgress } from "@/lib/calculations";
import { formatMinutes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/routine/status-badge";

type RoutineBoardProps = {
  tasks: RoutineTask[];
  onStatusChange: (taskId: string, status: RoutineStatus) => void;
};

const statuses: RoutineStatus[] = ["pending", "active", "completed", "skipped", "delayed", "missed"];

function getDisplayStatus(task: RoutineTask) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  if (task.status !== "pending") {
    return task.status;
  }

  const endTime = new Date(`${today}T${task.plannedEnd}:00`);
  return endTime < now ? "missed" : task.status;
}

export function RoutineBoard({ tasks, onStatusChange }: RoutineBoardProps) {
  const progress = getRoutineProgress(tasks);

  return (
    <Card title="Routine Board" eyebrow="Daily routine" id="routine">
      <div className="mb-5">
        <ProgressBar label={`${progress}% completed today`} tone="indigo" value={progress} />
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div className="grid min-w-0 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 2xl:grid-cols-[minmax(0,1fr)_auto]" key={task.id}>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="break-words text-sm font-semibold text-slate-800">{task.title}</h3>
                <StatusBadge status={getDisplayStatus(task)} />
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {task.category} | {task.plannedStart} - {task.plannedEnd}
                {typeof task.actualMinutes === "number" ? ` | actual ${formatMinutes(task.actualMinutes)}` : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 min-[460px]:grid-cols-3 sm:flex sm:flex-wrap 2xl:justify-end">
              {statuses.map((status) => (
                <Button
                  className="min-h-9 px-2 py-1 text-xs sm:min-h-8"
                  key={status}
                  onClick={() => onStatusChange(task.id, status)}
                  type="button"
                  variant={task.status === status ? "primary" : "secondary"}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
