"use client";

import { RoutineBoard } from "@/components/routine/routine-board";
import { useLifeOs } from "@/components/state/life-os-provider";
import { SectionHeader } from "@/components/ui/section-header";

export default function TasksPage() {
  const { tasks, updateTaskStatus } = useLifeOs();

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Tasks"
        title="Task board"
        description="Pending, active, completed, skipped, delayed, and missed routine tasks."
      />
      <RoutineBoard onStatusChange={updateTaskStatus} tasks={tasks} />
    </div>
  );
}
