"use client";

import { RoutineBoard } from "@/components/routine/routine-board";
import { RoutineForm } from "@/components/routine/routine-form";
import { useLifeOs } from "@/components/state/life-os-provider";
import { SectionHeader } from "@/components/ui/section-header";

export default function RoutinePage() {
  const { tasks, updateTaskStatus } = useLifeOs();

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Routine"
        title="Daily routine and work balance"
        description="Plan tasks, change status, and keep work and personal life visible."
      />
      <RoutineForm />
      <RoutineBoard onStatusChange={updateTaskStatus} tasks={tasks} />
    </div>
  );
}
