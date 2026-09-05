"use client";

import { History, Timer as TimerIcon } from "lucide-react";
import { useState } from "react";
import { TimerPanel } from "@/components/routine/timer-panel";
import { TimerHistory } from "@/components/routine/timer-history";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs } from "@/components/ui/tabs";

type TimerTab = "timer" | "history";

const tabs: Array<{ id: TimerTab; label: string; icon: typeof TimerIcon }> = [
  { id: "timer", label: "Timer & focus", icon: TimerIcon },
  { id: "history", label: "Saved sessions", icon: History },
];

export default function TimerPage() {
  const [activeTab, setActiveTab] = useState<TimerTab>("timer");

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Timer"
        title="Timer, stopwatch, and focus"
        description="Track actual time spent on work, home, learning, and personal tasks."
      />
      <section className="min-w-0">
        <Tabs ariaLabel="Timer views" onValueChange={setActiveTab} tabs={tabs} value={activeTab} />
        <div className="mt-5">
          {activeTab === "timer" ? <TimerPanel /> : <TimerHistory />}
        </div>
      </section>
    </div>
  );
}
