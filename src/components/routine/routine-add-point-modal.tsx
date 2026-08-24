"use client";

import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import type { RoutineTask } from "@/lib/types";
import { addMinutes, routineAlertOffsets, routineCategories } from "@/components/routine/routine-utils";

export type RoutinePointDraft = Omit<RoutineTask, "id" | "status" | "repeatRule"> &
  Partial<Pick<RoutineTask, "status" | "repeatRule">>;

type RoutineAddPointModalProps = {
  nextOrder: number;
  onAddPoint: (task: RoutinePointDraft) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function RoutineAddPointModal({ nextOrder, onAddPoint, onOpenChange, open }: RoutineAddPointModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const plannedStart = String(data.get("plannedStart") ?? "07:00");
    const duration = Math.max(5, Number(data.get("duration") ?? 30));
    const alertEnabled = data.get("alertEnabled") === "on";
    const alertOffsetMinutes = Number(data.get("alertOffsetMinutes") ?? 0);

    if (!title) {
      return;
    }

    onAddPoint({
      title,
      category: String(data.get("category") ?? "Personal"),
      priority: String(data.get("priority") ?? "medium") as RoutineTask["priority"],
      plannedStart,
      plannedEnd: addMinutes(plannedStart, duration),
      order: nextOrder,
      status: "pending",
      repeatRule: String(data.get("repeatRule") ?? "daily") as RoutineTask["repeatRule"],
      alertEnabled,
      alertOffsetMinutes,
      reminderAt: alertEnabled ? addMinutes(plannedStart, -alertOffsetMinutes) : "",
      note: String(data.get("note") ?? "").trim(),
    });

    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex h-[82vh] !w-[min(92vw,820px)] max-w-none grid-rows-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-4 py-3">
          <DialogTitle>Add routine point</DialogTitle>
          <DialogDescription>Write one notebook line with time, duration, repeat, and alert preference.</DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="grid min-w-0 gap-4 p-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FieldShell label="Point title">
                  <TextInput name="title" placeholder="Fajr, exercise, work block, bajar list" required />
                </FieldShell>
              </div>
              <FieldShell label="Start time">
                <TextInput defaultValue="07:00" name="plannedStart" type="time" required />
              </FieldShell>
              <FieldShell label="Duration">
                <TextInput defaultValue="30" min="5" name="duration" step="5" type="number" />
              </FieldShell>
              <FieldShell label="Category">
                <SelectInput name="category">
                  {routineCategories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </SelectInput>
              </FieldShell>
              <FieldShell label="Priority">
                <SelectInput defaultValue="medium" name="priority">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </SelectInput>
              </FieldShell>
              <FieldShell label="Repeat">
                <SelectInput defaultValue="daily" name="repeatRule">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                  <option value="once">Once</option>
                </SelectInput>
              </FieldShell>
              <FieldShell label="Alert before">
                <SelectInput defaultValue="10" name="alertOffsetMinutes">
                  {routineAlertOffsets.map((offset) => (
                    <option key={offset} value={offset}>
                      {offset === 0 ? "At time" : `${offset} minutes`}
                    </option>
                  ))}
                </SelectInput>
              </FieldShell>
              <label className="flex min-h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-800 shadow-sm">
                <input className="h-4 w-4 accent-emerald-600" defaultChecked name="alertEnabled" type="checkbox" />
                Alert this point
              </label>
              <div className="md:col-span-2">
                <FieldShell label="Note">
                  <TextArea className="min-h-24" name="note" placeholder="Optional details for this routine point" />
                </FieldShell>
              </div>
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 px-4 py-3">
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button icon={<Plus className="h-4 w-4" />} type="submit">
              Add routine point
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
