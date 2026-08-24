import { BriefcaseBusiness, LayoutList, Moon, Sunrise, type LucideIcon } from "lucide-react";
import type { RoutineStatus, RoutineTask } from "@/lib/types";

export type RoutineWindow = "full" | "morning" | "work" | "night";

export const routineCategories = ["Personal", "Work", "Home", "Family", "Health", "Learning"];
export const routineAlertOffsets = [0, 5, 10, 15, 30];

export const routineWindows: Array<{ id: RoutineWindow; label: string; Icon: LucideIcon }> = [
  { id: "full", label: "Full day", Icon: LayoutList },
  { id: "morning", label: "Morning", Icon: Sunrise },
  { id: "work", label: "Workday", Icon: BriefcaseBusiness },
  { id: "night", label: "Night", Icon: Moon },
];

export const routineStatusLabels: Record<RoutineStatus, string> = {
  pending: "Waiting",
  active: "Now",
  completed: "Done",
  skipped: "Skipped",
  delayed: "Delayed",
  missed: "Missed",
};

export function timeToMinutes(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

export function minutesToTime(totalMinutes: number) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function addMinutes(time: string, minutes: number) {
  return minutesToTime(timeToMinutes(time) + minutes);
}

export function getRoutineDuration(task: RoutineTask) {
  const start = timeToMinutes(task.plannedStart);
  const end = timeToMinutes(task.plannedEnd);
  return end >= start ? end - start : end + 1440 - start;
}

export function getRoutineAlertTime(task: RoutineTask) {
  if (task.reminderAt) {
    return task.reminderAt;
  }

  return addMinutes(task.plannedStart, -(task.alertOffsetMinutes ?? 0));
}

export function getRoutineTaskOrder(task: RoutineTask, index: number) {
  return task.order ?? index + 1;
}

export function sortRoutineTasks(tasks: RoutineTask[]) {
  return [...tasks].sort((a, b) => {
    const orderA = a.order ?? 9999;
    const orderB = b.order ?? 9999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return timeToMinutes(a.plannedStart) - timeToMinutes(b.plannedStart);
  });
}

export function isTaskInRoutineWindow(task: RoutineTask, windowId: RoutineWindow) {
  const start = timeToMinutes(task.plannedStart);

  if (windowId === "morning") {
    return start < 12 * 60;
  }

  if (windowId === "work") {
    return task.category === "Work" || (start >= 9 * 60 && start < 18 * 60);
  }

  if (windowId === "night") {
    return start >= 18 * 60;
  }

  return true;
}

export function getRoutineDisplayStatus(task: RoutineTask): RoutineStatus {
  if (task.status !== "pending") {
    return task.status;
  }

  const endTime = new Date();
  const [hours, minutes] = task.plannedEnd.split(":").map(Number);
  endTime.setHours(hours, minutes, 0, 0);

  return endTime < new Date() ? "missed" : "pending";
}

export function getRoutineStatusTone(status: RoutineStatus) {
  if (status === "completed") {
    return "success";
  }

  if (status === "active") {
    return "indigo";
  }

  if (status === "delayed" || status === "missed") {
    return "warning";
  }

  if (status === "skipped") {
    return "neutral";
  }

  return "teal";
}

export function isRoutineQuietTime(time: string, quietStart: string, quietEnd: string) {
  const current = timeToMinutes(time);
  const start = timeToMinutes(quietStart);
  const end = timeToMinutes(quietEnd);

  if (start === end) {
    return false;
  }

  if (start < end) {
    return current >= start && current < end;
  }

  return current >= start || current < end;
}

export function getTodayAtTime(time: string) {
  const date = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function getNextRunnableRoutineTask(tasks: RoutineTask[], fromIndex = -1) {
  return tasks.find((task, index) => index > fromIndex && !["completed", "skipped"].includes(task.status));
}
