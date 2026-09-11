"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { getBudgetStatus } from "@/lib/budget-utils";
import type { BudgetCategory } from "@/lib/types";
import { budgetService } from "@/services/budget.service";
import { categoriesService } from "@/services/categories.service";
import type { Budget, BudgetModalMode, BudgetStatus, BudgetType } from "@/types/budget.types";

type BudgetModalProps = {
  mode: BudgetModalMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget;
  onSaved?: () => void;
};

const colorOptions = [
  { label: "Teal", value: "teal" },
  { label: "Amber", value: "amber" },
  { label: "Rose", value: "rose" },
  { label: "Indigo", value: "indigo" },
];

export function BudgetModal({ mode, open, onOpenChange, budget, onSaved }: BudgetModalProps) {
  const [hasExtraNote, setHasExtraNote] = useState(Boolean(budget?.extraNote));
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = mode === "edit";

  useEffect(() => {
    if (!open || isEdit) {
      return;
    }
    async function loadCategories() {
      setIsCategoriesLoading(true);
      setError("");
      try {
        const response = await categoriesService.list();
        setCategories(response);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to load categories.");
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    void loadCategories();
  }, [isEdit, open]);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (nextOpen) {
      setHasExtraNote(Boolean(budget?.extraNote));
    }
    if (!nextOpen) {
      setError("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const status = String(data.get("status") ?? "active") as BudgetStatus;
    const targetPrice = Number(data.get("targetPrice")) || 0;
    const categoryName = isEdit
      ? (budget?.name ?? "")
      : String(data.get("categoryName") ?? "").trim();
    const color = isEdit ? String(data.get("color") ?? "teal") : "teal";

    if (!categoryName) {
      return;
    }

    const nextBudget: Omit<Budget, "id"> = {
      name: categoryName,
      type: String(data.get("type") ?? "monthly") as BudgetType,
      monthlyLimit: targetPrice,
      startDate: String(data.get("startDate") ?? ""),
      endDate: String(data.get("endDate") ?? ""),
      status,
      note: String(data.get("note") ?? "").trim(),
      extraNote: hasExtraNote ? String(data.get("extraNote") ?? "").trim() : "",
      color,
      isActive: status === "active",
    };

    setIsSaving(true);
    setError("");

    try {
      if (isEdit && budget) {
        await budgetService.update(budget.id, nextBudget);
      } else {
        await budgetService.create(nextBudget);
      }
      form.reset();
      setHasExtraNote(false);
      onSaved?.();
      onOpenChange(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to save budget.");
    } finally {
      setIsSaving(false);
    }
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
              <FieldShell label="Category">
                {isEdit ? (
                  <TextInput defaultValue={budget?.name ?? ""} readOnly />
                ) : isCategoriesLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <SelectInput disabled={isSaving} name="categoryName" required>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </SelectInput>
                )}
              </FieldShell>
              <FieldShell label="Budget type">
                <SelectInput defaultValue={budget?.type ?? "monthly"} name="type">
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                </SelectInput>
              </FieldShell>
              <FieldShell label="Start date">
                <TextInput
                  defaultValue={budget?.startDate ?? ""}
                  name="startDate"
                  required
                  type="date"
                />
              </FieldShell>
              <FieldShell label="End date">
                <TextInput
                  defaultValue={budget?.endDate ?? ""}
                  name="endDate"
                  required
                  type="date"
                />
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
                <SelectInput
                  defaultValue={budget ? getBudgetStatus(budget) : "active"}
                  name="status"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </SelectInput>
              </FieldShell>
              {isEdit && (
                <FieldShell label="Color">
                  <SelectInput defaultValue={budget?.color ?? "teal"} name="color">
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </SelectInput>
                </FieldShell>
              )}
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
              {error && <p className="text-sm font-medium text-red-500 md:col-span-2">{error}</p>}
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 px-4 py-3">
            <Button
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isSaving || isCategoriesLoading} type="submit">
              {isSaving ? "Saving..." : isEdit ? "Update budget" : "Save budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
