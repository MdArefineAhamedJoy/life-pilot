"use client";

import { useState, type FormEvent } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
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
import type { BudgetCategory } from "@/lib/types";

type BudgetStatus = "active" | "paused" | "completed";
type BudgetType = "daily" | "weekly" | "monthly";
type BudgetModalMode = "create" | "edit";

type BudgetModalProps = {
  mode: BudgetModalMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: BudgetCategory;
};

const colorOptions = [
  { label: "Teal", value: "teal" },
  { label: "Amber", value: "amber" },
  { label: "Rose", value: "rose" },
  { label: "Indigo", value: "indigo" },
];

function getBudgetStatus(category: BudgetCategory): BudgetStatus {
  return category.status ?? (category.isActive ? "active" : "paused");
}

export function BudgetModal({ mode, open, onOpenChange, budget }: BudgetModalProps) {
  const { addBudgetCategory, updateBudgetCategory } = useLifeOs();
  const [hasExtraNote, setHasExtraNote] = useState(Boolean(budget?.extraNote));
  const isEdit = mode === "edit";

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (nextOpen) {
      setHasExtraNote(Boolean(budget?.extraNote));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const status = String(data.get("status") ?? "active") as BudgetStatus;
    const targetPrice = Number(data.get("targetPrice")) || 0;
    const nextBudget: Omit<BudgetCategory, "id"> = {
      name: String(data.get("categoryName") ?? "").trim(),
      type: String(data.get("type") ?? "monthly") as BudgetType,
      monthlyLimit: targetPrice,
      startDate: String(data.get("startDate") ?? ""),
      endDate: String(data.get("endDate") ?? ""),
      status,
      note: String(data.get("note") ?? "").trim(),
      extraNote: hasExtraNote ? String(data.get("extraNote") ?? "").trim() : "",
      color: String(data.get("color") ?? "teal"),
      isActive: status === "active",
    };

    if (isEdit && budget) {
      updateBudgetCategory(budget.id, nextBudget);
    } else {
      addBudgetCategory(nextBudget);
      form.reset();
      setHasExtraNote(false);
    }

    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="flex h-[82vh] !w-[min(92vw,760px)] max-w-none grid-rows-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-4 py-3">
          <DialogTitle>{isEdit ? "Edit Budget" : "Create Budget"}</DialogTitle>
          <DialogDescription>
            Add category, date range, target price, status, note, and extra details.
          </DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="grid min-w-0 grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <FieldShell label="Category name">
                <TextInput
                  defaultValue={budget?.name ?? ""}
                  name="categoryName"
                  placeholder="Home rent, grocery, savings"
                  required
                />
              </FieldShell>
              <FieldShell label="Budget type">
                <SelectInput defaultValue={budget?.type ?? "monthly"} name="type">
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                </SelectInput>
              </FieldShell>
              <FieldShell label="Start date">
                <TextInput defaultValue={budget?.startDate ?? ""} name="startDate" required type="date" />
              </FieldShell>
              <FieldShell label="End date">
                <TextInput defaultValue={budget?.endDate ?? ""} name="endDate" required type="date" />
              </FieldShell>
              <FieldShell label="Target price">
                <TextInput
                  defaultValue={budget?.monthlyLimit ?? ""}
                  min="0"
                  name="targetPrice"
                  placeholder="15000"
                  required
                  type="number"
                />
              </FieldShell>
              <FieldShell label="Status">
                <SelectInput defaultValue={budget ? getBudgetStatus(budget) : "active"} name="status">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </SelectInput>
              </FieldShell>
              <FieldShell label="Color">
                <SelectInput defaultValue={budget?.color ?? "teal"} name="color">
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectInput>
              </FieldShell>
              <label className="flex min-h-9 items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-800 shadow-sm">
                <input
                  checked={hasExtraNote}
                  className="size-4 accent-emerald-600"
                  onChange={(event) => setHasExtraNote(event.target.checked)}
                  type="checkbox"
                />
                Extra note option
              </label>
              <div className="md:col-span-2">
                <FieldShell label="Note">
                  <TextArea
                    className="min-h-24"
                    defaultValue={budget?.note ?? ""}
                    name="note"
                    placeholder="Budget purpose, reminder, or plan"
                  />
                </FieldShell>
              </div>
              {hasExtraNote && (
                <div className="md:col-span-2">
                  <FieldShell label="Extra note">
                    <TextArea
                      className="min-h-24"
                      defaultValue={budget?.extraNote ?? ""}
                      name="extraNote"
                      placeholder="Any extra details"
                    />
                  </FieldShell>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 px-4 py-3">
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Update budget" : "Save budget"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
