"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, BellOff, Plus, RotateCcw } from "lucide-react";
import { RoutineAddPointModal } from "@/components/routine/routine-add-point-modal";
import { RoutineNotebook } from "@/components/routine/routine-notebook";
import { RoutineNotificationToast } from "@/components/routine/routine-notification-toast";
import { RoutineRunModePanel } from "@/components/routine/routine-run-mode-panel";
import {
  addMinutes,
  getNextRunnableRoutineTask,
  getRoutineAlertTime,
  getRoutineDisplayStatus,
  getTodayAtTime,
  isRoutineQuietTime,
  isTaskInRoutineWindow,
  sortRoutineTasks,
  timeToMinutes,
  type RoutineWindow,
} from "@/components/routine/routine-utils";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import type { RoutineTask } from "@/lib/types";

type BrowserNotificationState = NotificationPermission | "unsupported";

export default function RoutinePage() {
  const {
    tasks,
    settings,
    addTask,
    deleteTask,
    reorderTasks,
    updateSettings,
    updateTask,
    updateTaskStatus,
  } = useLifeOs();
  const [routineWindow, setRoutineWindow] = useState<RoutineWindow>("full");
  const [permission, setPermission] = useState<BrowserNotificationState>("default");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [liveAlert, setLiveAlert] = useState<string | null>(null);
  const [isNotificationToastOpen, setIsNotificationToastOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const orderedTasks = useMemo(() => sortRoutineTasks(tasks), [tasks]);
  const visibleTasks = useMemo(
    () => orderedTasks.filter((task) => isTaskInRoutineWindow(task, routineWindow)),
    [orderedTasks, routineWindow],
  );
  const completedCount = orderedTasks.filter((task) => task.status === "completed").length;
  const alertCount = orderedTasks.filter((task) => task.alertEnabled).length;
  const missedCount = orderedTasks.filter((task) => getRoutineDisplayStatus(task) === "missed").length;
  const progress = orderedTasks.length > 0 ? Math.round((completedCount / orderedTasks.length) * 100) : 0;
  const currentTask =
    orderedTasks.find((task) => task.id === activeTaskId) ??
    orderedTasks.find((task) => task.status === "active") ??
    getNextRunnableRoutineTask(orderedTasks);
  const currentTaskIndex = currentTask ? orderedTasks.findIndex((task) => task.id === currentTask.id) : -1;
  const currentTaskPosition = currentTaskIndex >= 0 ? currentTaskIndex + 1 : 0;
  const upcomingTask = currentTaskIndex >= 0 ? getNextRunnableRoutineTask(orderedTasks, currentTaskIndex) : undefined;
  const nextAlert = orderedTasks
    .filter((task) => task.alertEnabled && !["completed", "skipped"].includes(task.status))
    .sort((a, b) => timeToMinutes(getRoutineAlertTime(a)) - timeToMinutes(getRoutineAlertTime(b)))[0];
  const notificationMessage =
    liveAlert ?? (nextAlert ? `Next alert: ${nextAlert.title} at ${getRoutineAlertTime(nextAlert)}` : undefined);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (typeof window === "undefined" || !("Notification" in window)) {
        setPermission("unsupported");
        return;
      }

      setPermission(Notification.permission);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window) || permission !== "granted") {
      return;
    }

    const timeoutIds = orderedTasks
      .filter((task) => task.alertEnabled && !["completed", "skipped"].includes(task.status))
      .map((task) => {
        const alertTime = getRoutineAlertTime(task);

        if (isRoutineQuietTime(alertTime, settings.quietHoursStart, settings.quietHoursEnd)) {
          return null;
        }

        const delay = getTodayAtTime(alertTime).getTime() - Date.now();

        if (delay < 0 || delay > 1000 * 60 * 60 * 12) {
          return null;
        }

        return window.setTimeout(() => {
          setLiveAlert(`${task.title} starts at ${task.plannedStart}`);
          new Notification(task.title, {
            body: `${task.category} routine point starts at ${task.plannedStart}.`,
          });
        }, delay);
      })
      .filter((timeoutId): timeoutId is number => typeof timeoutId === "number");

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [orderedTasks, permission, settings.quietHoursEnd, settings.quietHoursStart]);

  async function requestNotificationAccess() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }

    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);
    updateSettings({ notificationEnabled: nextPermission === "granted" });

    if (nextPermission === "granted") {
      setLiveAlert("Notifications are enabled for alert points.");
    }
  }

  function moveTask(taskId: string, direction: "up" | "down") {
    const ids = orderedTasks.map((task) => task.id);
    const currentIndex = ids.indexOf(taskId);
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= ids.length) {
      return;
    }

    [ids[currentIndex], ids[nextIndex]] = [ids[nextIndex], ids[currentIndex]];
    reorderTasks(ids);
  }

  function startTask(task: RoutineTask) {
    setActiveTaskId(task.id);
    updateTaskStatus(task.id, "active");
  }

  function startRoutine() {
    if (currentTask) {
      startTask(currentTask);
    }
  }

  function completeCurrentTask() {
    if (!currentTask) {
      return;
    }

    const nextTask = getNextRunnableRoutineTask(orderedTasks, currentTaskIndex);
    updateTaskStatus(currentTask.id, "completed");

    if (nextTask) {
      startTask(nextTask);
    } else {
      setActiveTaskId(null);
    }
  }

  function skipCurrentTask() {
    if (!currentTask) {
      return;
    }

    const nextTask = getNextRunnableRoutineTask(orderedTasks, currentTaskIndex);
    updateTaskStatus(currentTask.id, "skipped");

    if (nextTask) {
      startTask(nextTask);
    } else {
      setActiveTaskId(null);
    }
  }

  function delayTask(task: RoutineTask) {
    updateTask(task.id, {
      plannedStart: addMinutes(task.plannedStart, 15),
      plannedEnd: addMinutes(task.plannedEnd, 15),
      reminderAt: task.alertEnabled ? addMinutes(getRoutineAlertTime(task), 15) : task.reminderAt,
      status: "delayed",
    });
  }

  function resetRoutine() {
    orderedTasks.forEach((task) => {
      updateTask(task.id, { completedAt: undefined });
      updateTaskStatus(task.id, "pending");
    });
    setActiveTaskId(null);
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <SectionHeader
          eyebrow="Routine"
          title="Daily routine notebook"
          description="A khata-style ordered routine with points, alerts, run mode, and quick review for the day."
        />
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap xl:shrink-0 xl:justify-end">
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsAddModalOpen(true)} type="button">
            Add routine point
          </Button>
          <RoutineNotificationToast
            hasNotification={Boolean(notificationMessage)}
            message={notificationMessage}
            onDismiss={() => setIsNotificationToastOpen(false)}
            onOpen={() => setIsNotificationToastOpen(true)}
            open={isNotificationToastOpen}
          />
          <Button
            icon={permission === "granted" ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            onClick={requestNotificationAccess}
            type="button"
            variant={permission === "granted" ? "secondary" : "outline"}
          >
            {permission === "granted" ? "Alerts on" : "Enable alerts"}
          </Button>
          <Button icon={<RotateCcw className="h-4 w-4" />} onClick={resetRoutine} type="button" variant="outline">
            Reset day
          </Button>
        </div>
      </div>

      <RoutineRunModePanel
        alertCount={alertCount}
        completedText={`${completedCount}/${orderedTasks.length}`}
        currentTask={currentTask}
        currentTaskPosition={currentTaskPosition}
        missedCount={missedCount}
        onComplete={completeCurrentTask}
        onDelay={() => currentTask && delayTask(currentTask)}
        onSkip={skipCurrentTask}
        onStart={startRoutine}
        progress={progress}
        quietHours={`${settings.quietHoursStart}-${settings.quietHoursEnd}`}
        totalTasks={orderedTasks.length}
        upcomingTask={upcomingTask}
      />

      <RoutineNotebook
        currentTaskId={currentTask?.id}
        onCompleteTask={(taskId) => updateTaskStatus(taskId, "completed")}
        onDelayTask={delayTask}
        onDeleteTask={deleteTask}
        onMoveTask={moveTask}
        onSkipTask={(taskId) => updateTaskStatus(taskId, "skipped")}
        onStartTask={startTask}
        onToggleAlert={(task) =>
          updateTask(task.id, {
            alertEnabled: !task.alertEnabled,
            reminderAt: !task.alertEnabled ? getRoutineAlertTime(task) : "",
          })
        }
        orderedTasks={orderedTasks}
        progress={progress}
        routineWindow={routineWindow}
        setRoutineWindow={setRoutineWindow}
        visibleTasks={visibleTasks}
      />

      <RoutineAddPointModal
        nextOrder={orderedTasks.length + 1}
        onAddPoint={addTask}
        onOpenChange={setIsAddModalOpen}
        open={isAddModalOpen}
      />

      {permission === "unsupported" && (
        <p className="text-sm text-slate-500">
          Browser notifications are not supported here. In-app alerts will still appear while this page is open.
        </p>
      )}
    </div>
  );
}
