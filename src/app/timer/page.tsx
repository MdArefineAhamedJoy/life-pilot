"use client";

import { TimerPanel } from "@/components/routine/timer-panel";
import { TimerHistory } from "@/components/routine/timer-history";
import { SectionHeader } from "@/components/ui/section-header";

export default function TimerPage() {
  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Timer"
        title="Timer, stopwatch, and focus"
        description="Track actual time spent on work, home, learning, and personal tasks."
      />
      <TimerPanel />
      <TimerHistory />
    </div>
  );
}
