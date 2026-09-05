"use client";

import type { FormEvent } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import type { RoutineStatus, RoutineTask } from "@/lib/types";

export type TaskDraft = Omit<RoutineTask, "id" | "completedAt">;

type TaskEditorDialogProps = {
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  onSave: (task: TaskDraft) => void;
  open: boolean;
  task?: RoutineTask;
};

const statuses: RoutineStatus[] = ["pending", "active", "completed", "skipped", "delayed", "missed"];

export function TaskEditorDialog({ mode, onOpenChange, onSave, open, task }: TaskEditorDialogProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();

    if (!title) return;

    onSave({
      title,
      category: String(data.get("category") ?? "General").trim() || "General",
      priority: String(data.get("priority") ?? "medium") as RoutineTask["priority"],
      plannedStart: String(data.get("plannedStart") ?? "09:00"),
      plannedEnd: String(data.get("plannedEnd") ?? "10:00"),
      order: task?.order,
      actualMinutes: task?.actualMinutes,
      status: String(data.get("status") ?? "pending") as RoutineStatus,
      repeatRule: String(data.get("repeatRule") ?? "once") as RoutineTask["repeatRule"],
      alertEnabled: data.get("alertEnabled") === "on",
      alertOffsetMinutes: Number(data.get("alertOffsetMinutes") ?? 10),
      reminderAt: String(data.get("reminderAt") ?? ""),
      note: String(data.get("note") ?? "").trim(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex max-h-[88vh] !w-[min(94vw,760px)] max-w-none grid-rows-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-5 py-4">
          <DialogTitle>{mode === "create" ? "Create task" : "Edit task"}</DialogTitle>
          <DialogDescription>Title is required. Add only the planning details that help you take the next action.</DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FieldShell label="Task title">
                  <TextInput defaultValue={task?.title} name="title" placeholder="Describe the next action" required />
                </FieldShell>
              </div>
              <FieldShell label="Project or area">
                <TextInput defaultValue={task?.category ?? "General"} name="category" placeholder="Work, Health, Home…" />
              </FieldShell>
              <FieldShell label="Priority">
                <SelectInput defaultValue={task?.priority ?? "medium"} name="priority">
                  <option value="high">High — do first</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low — when time allows</option>
                </SelectInput>
              </FieldShell>
              <FieldShell label="Status">
                <SelectInput defaultValue={task?.status ?? "pending"} name="status">
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </SelectInput>
              </FieldShell>
              <FieldShell label="Repeat">
                <SelectInput defaultValue={task?.repeatRule ?? "once"} name="repeatRule">
                  <option value="once">One time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </SelectInput>
              </FieldShell>
              <FieldShell label="Start time">
                <TextInput defaultValue={task?.plannedStart ?? "09:00"} name="plannedStart" type="time" />
              </FieldShell>
              <FieldShell label="End time">
                <TextInput defaultValue={task?.plannedEnd ?? "10:00"} name="plannedEnd" type="time" />
              </FieldShell>
              <FieldShell label="Reminder time" hint="Leave empty if you do not need a reminder.">
                <TextInput defaultValue={task?.reminderAt ?? ""} name="reminderAt" type="time" />
              </FieldShell>
              <FieldShell label="Reminder lead time">
                <SelectInput defaultValue={String(task?.alertOffsetMinutes ?? 10)} name="alertOffsetMinutes">
                  <option value="0">At start time</option>
                  <option value="5">5 minutes before</option>
                  <option value="10">10 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                </SelectInput>
              </FieldShell>
              <label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-800">
                <input className="size-4 accent-emerald-600" defaultChecked={task?.alertEnabled ?? false} name="alertEnabled" type="checkbox" />
                Enable reminder
              </label>
              <div className="md:col-span-2">
                <FieldShell label="Description / notes">
                  <TextArea className="min-h-28" defaultValue={task?.note ?? ""} name="note" placeholder="Context, definition of done, or a useful link…" />
                </FieldShell>
              </div>
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 px-5 py-4">
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline">Cancel</Button>
            <Button icon={mode === "create" ? <Plus className="size-4" /> : <Check className="size-4" />} type="submit">
              {mode === "create" ? "Create task" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
