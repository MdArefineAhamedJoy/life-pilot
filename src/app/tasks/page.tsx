"use client";

import { CircleCheck, ListFilter, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { TaskEditorDialog, type TaskDraft } from "@/components/tasks/task-editor-dialog";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { SelectInput, TextInput } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";
import type { RoutineStatus, RoutineTask } from "@/lib/types";
import { cn, formatMinutes } from "@/lib/utils";

const statusOptions: Array<{ value: "all" | RoutineStatus; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "To do" },
  { value: "active", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "delayed", label: "Delayed" },
  { value: "skipped", label: "Skipped" },
  { value: "missed", label: "Missed" },
];

const statusStyle: Record<RoutineStatus, string> = {
  pending: "bg-slate-100 text-slate-700",
  active: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  delayed: "bg-amber-50 text-amber-700",
  skipped: "bg-violet-50 text-violet-700",
  missed: "bg-red-50 text-red-700",
};

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <div className="border border-slate-200 bg-white px-4 py-3 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className={cn("mt-2 font-mono text-2xl font-semibold", tone)}>{value}</p></div>;
}

export default function TasksPage() {
  const { addTask, deleteTask, tasks, updateTask, updateTaskStatus } = useLifeOs();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RoutineStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | RoutineTask["priority"]>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<RoutineTask | undefined>();

  const filteredTasks = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...tasks]
      .filter((task) => statusFilter === "all" || task.status === statusFilter)
      .filter((task) => priorityFilter === "all" || task.priority === priorityFilter)
      .filter((task) => !term || [task.title, task.category, task.note].filter(Boolean).join(" ").toLowerCase().includes(term))
      .sort((left, right) => {
        const statusOrder = left.status === "active" ? -1 : right.status === "active" ? 1 : 0;
        return statusOrder || (left.order ?? 9999) - (right.order ?? 9999) || left.plannedStart.localeCompare(right.plannedStart);
      });
  }, [priorityFilter, query, statusFilter, tasks]);

  const metrics = {
    active: tasks.filter((task) => task.status === "active").length,
    pending: tasks.filter((task) => task.status === "pending").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    needsAttention: tasks.filter((task) => ["delayed", "missed"].includes(task.status)).length,
  };

  function saveNewTask(draft: TaskDraft) {
    addTask({ ...draft, order: tasks.length + 1 });
  }

  function saveEditedTask(draft: TaskDraft) {
    if (!editingTask) return;
    updateTask(editingTask.id, draft);
    if (draft.status === "completed" && editingTask.status !== "completed") {
      updateTaskStatus(editingTask.id, "completed");
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow="Tasks" title="Task board" description="Plan work clearly, then update one reliable task record as its status changes." />
        <Button className="lg:mb-1" icon={<Plus className="size-4" />} onClick={() => setIsCreateOpen(true)} type="button">Create task</Button>
      </div>

      <div className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="In progress" tone="text-blue-700" value={metrics.active} />
        <Metric label="To do" tone="text-slate-800" value={metrics.pending} />
        <Metric label="Completed" tone="text-emerald-700" value={metrics.completed} />
        <Metric label="Needs attention" tone="text-amber-700" value={metrics.needsAttention} />
      </div>

      <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <TextInput aria-label="Search tasks" onChange={(event) => setQuery(event.target.value)} placeholder="Search title, project, or details" value={query} />
          <SelectInput aria-label="Filter by status" onChange={(event) => setStatusFilter(event.target.value as "all" | RoutineStatus)} value={statusFilter}>
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </SelectInput>
          <SelectInput aria-label="Filter by priority" onChange={(event) => setPriorityFilter(event.target.value as "all" | RoutineTask["priority"])} value={priorityFilter}>
            <option value="all">All priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option>
          </SelectInput>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500"><ListFilter className="size-4" />{filteredTasks.length} task{filteredTasks.length === 1 ? "" : "s"} shown</div>

        <div className="mt-4 space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center"><CircleCheck className="mx-auto size-7 text-slate-400" /><p className="mt-3 font-semibold text-slate-800">No matching tasks</p><p className="mt-1 text-sm text-slate-500">Create a task or adjust the filters to see your work.</p></div>
          ) : filteredTasks.map((task) => (
            <article className="border border-slate-200 bg-white p-4 transition hover:border-emerald-300" key={task.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold text-slate-950">{task.title}</h2><span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusStyle[task.status])}>{task.status}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{task.priority}</span></div>
                  <p className="mt-2 text-sm font-medium text-slate-600">{task.category} · {task.plannedStart}–{task.plannedEnd} · {task.repeatRule}</p>
                  {task.note && <p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-slate-600">{task.note}</p>}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500"><span>{task.alertEnabled && task.reminderAt ? `Reminder ${task.reminderAt}` : "No reminder"}</span>{typeof task.actualMinutes === "number" && <span>{formatMinutes(task.actualMinutes)} tracked</span>}</div>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <SelectInput aria-label={`Set ${task.title} status`} className="w-36" onChange={(event) => updateTaskStatus(task.id, event.target.value as RoutineStatus)} value={task.status}>{statusOptions.slice(1).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</SelectInput>
                  <Button icon={<Pencil className="size-4" />} onClick={() => setEditingTask(task)} type="button" variant="outline">Edit</Button>
                  <Button aria-label={`Delete ${task.title}`} icon={<Trash2 className="size-4" />} onClick={() => deleteTask(task.id)} type="button" variant="ghost">Delete</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <TaskEditorDialog mode="create" onOpenChange={setIsCreateOpen} onSave={saveNewTask} open={isCreateOpen} />
      <TaskEditorDialog mode="edit" onOpenChange={(open) => { if (!open) setEditingTask(undefined); }} onSave={saveEditedTask} open={Boolean(editingTask)} task={editingTask} />
    </div>
  );
}
