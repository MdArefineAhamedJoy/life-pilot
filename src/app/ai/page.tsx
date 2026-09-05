"use client";

import { Bot, CheckCircle2, CircleAlert, ListPlus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectInput, TextArea } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";
import type { RoutineTask } from "@/lib/types";

function Insight({ icon: Icon, title, detail, tone }: { icon: typeof Bot; title: string; detail: string; tone: string }) {
  return <div className="flex gap-3 border border-slate-200 bg-white p-4"><span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${tone}`}><Icon className="size-4" /></span><div><p className="font-semibold text-slate-950">{title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p></div></div>;
}

export default function AiPage() {
  const { addTask, notes, settings, tasks, updateSettings, updateTaskStatus } = useLifeOs();
  const [taskIdea, setTaskIdea] = useState("");
  const [message, setMessage] = useState("");

  const plan = useMemo(() => {
    const open = tasks.filter((task) => !["completed", "skipped"].includes(task.status));
    const highPriority = open.filter((task) => task.priority === "high");
    const attention = open.filter((task) => ["delayed", "missed"].includes(task.status));
    const nextTask = [...open].sort((a, b) => {
      const priority = { high: 0, medium: 1, low: 2 };
      return priority[a.priority] - priority[b.priority] || a.plannedStart.localeCompare(b.plannedStart);
    })[0];
    return { attention, highPriority, nextTask, open };
  }, [tasks]);

  function createFromIdea() {
    const title = taskIdea.trim();
    if (!title) {
      setMessage("Write a task idea first.");
      return;
    }
    addTask({
      title,
      category: "General",
      priority: "medium",
      plannedStart: "09:00",
      plannedEnd: "10:00",
      repeatRule: "once",
      alertEnabled: false,
      alertOffsetMinutes: 10,
      status: "pending",
      note: "Created from the planning assistant.",
    });
    setTaskIdea("");
    setMessage("Task created and queued in your task board.");
  }

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader eyebrow="AI Assistant" title="Planning assistant" description="Turn a rough idea into a task and review live workload signals before you choose what to do next." />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <Card title="Capture a task idea" eyebrow="Local planning flow" action={<Sparkles aria-hidden="true" className="size-5 text-emerald-600" />}>
          <p className="text-sm leading-6 text-slate-600">This action creates a real pending task through the same protected Life OS data flow. It does not send your text to an external AI provider.</p>
          <div className="mt-4 space-y-3"><TextArea className="min-h-28" onChange={(event) => { setTaskIdea(event.target.value); setMessage(""); }} placeholder="Write the next action you need to remember…" value={taskIdea} /><div className="flex flex-wrap items-center gap-3"><Button icon={<ListPlus className="size-4" />} onClick={createFromIdea} type="button">Create task</Button>{message && <p className="text-sm font-medium text-emerald-700">{message}</p>}</div></div>
        </Card>

        <Card title="Next best action" eyebrow="Live task data" action={<Bot aria-hidden="true" className="size-5 text-blue-600" />}>
          {plan.nextTask ? <><p className="text-lg font-semibold text-slate-950">{plan.nextTask.title}</p><p className="mt-2 text-sm text-slate-600">{plan.nextTask.category} · {plan.nextTask.priority} priority · {plan.nextTask.plannedStart}</p><Button className="mt-5" icon={<CheckCircle2 className="size-4" />} onClick={() => updateTaskStatus(plan.nextTask!.id, "active")} type="button" variant="secondary">Start this task</Button></> : <p className="text-sm leading-6 text-slate-600">No open tasks yet. Capture one idea and it will appear here.</p>}
        </Card>
      </div>

      <section className="grid gap-3 lg:grid-cols-3">
        <Insight detail={`${plan.open.length} task${plan.open.length === 1 ? "" : "s"} are still open.`} icon={Bot} title="Open work" tone="bg-blue-50 text-blue-700" />
        <Insight detail={plan.highPriority.length ? `${plan.highPriority.length} high-priority task${plan.highPriority.length === 1 ? " needs" : "s need"} focus.` : "No high-priority tasks are waiting."} icon={Sparkles} title="Focus load" tone="bg-violet-50 text-violet-700" />
        <Insight detail={plan.attention.length ? `${plan.attention.length} task${plan.attention.length === 1 ? " is" : "s are"} delayed or missed.` : "Nothing is currently delayed or missed."} icon={CircleAlert} title="Needs attention" tone="bg-amber-50 text-amber-700" />
      </section>

      <Card title="AI provider" eyebrow="Private by default" action={<Bot aria-hidden="true" className="size-5 text-emerald-600" />}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"><label className="block space-y-2 text-sm font-semibold text-slate-700">AI mode<SelectInput onChange={(event) => updateSettings({ aiProvider: event.target.value as "off" | "free-api" | "local" })} value={settings.aiProvider}><option value="off">Off — no external AI requests</option><option value="local">Local model</option><option value="free-api">External provider</option></SelectInput></label><div className="border-l-2 border-slate-200 pl-4 text-sm leading-6 text-slate-600"><p><strong className="text-slate-800">Current setting:</strong> {settings.aiProvider === "off" ? "No external AI calls are enabled." : "Provider selection is saved to your protected settings."}</p><p className="mt-2">Your workspace has {notes.length} note{notes.length === 1 ? "" : "s"} available for future AI-assisted review. Credentials are never stored in the browser.</p></div></div>
      </Card>
    </div>
  );
}
