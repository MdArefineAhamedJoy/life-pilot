"use client";

import { Pencil, Plus } from "lucide-react";
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

type BadgeTone = "teal" | "amber" | "rose" | "indigo";
type CategoryStatus = "active" | "pushed" | "blocked";

type CategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: BudgetCategory;
};

const colorOptions: Array<{ label: string; value: BadgeTone }> = [
  { label: "Teal", value: "teal" },
  { label: "Amber", value: "amber" },
  { label: "Rose", value: "rose" },
  { label: "Indigo", value: "indigo" },
];

export function CategoryModal({ open, onOpenChange, category }: CategoryModalProps) {
  const { addBudgetCategory, categories, updateBudgetCategory } = useLifeOs();
  const [error, setError] = useState("");
  const isEdit = Boolean(category);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setError("");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const color = String(data.get("color") ?? "teal") as BadgeTone;
    const status = String(data.get("status") ?? "active") as CategoryStatus;
    const note = String(data.get("note") ?? "").trim();

    if (!name) {
      setError("Category name is required.");
      return;
    }

    const exists = categories.some(
      (existingCategory) =>
        existingCategory.id !== category?.id && existingCategory.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      setError("This category already exists.");
      return;
    }

    const nextCategory: Omit<BudgetCategory, "id"> = {
      type: category?.type ?? "monthly",
      monthlyLimit: category?.monthlyLimit ?? 0,
      weeklyLimit: category?.weeklyLimit ?? 0,
      dailyLimit: category?.dailyLimit ?? 0,
      startDate: category?.startDate ?? "",
      endDate: category?.endDate ?? "",
      extraNote: category?.extraNote ?? "",
      status: category?.status,
      categoryStatus: status,
      name,
      note,
      color,
      isActive: status === "active",
    };

    if (category) {
      updateBudgetCategory(category.id, nextCategory);
    } else {
      addBudgetCategory(nextCategory);
    }

    setError("");
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="flex h-[82vh] !w-[min(92vw,760px)] max-w-none grid-rows-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-4 py-3">
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this reusable category for budget and expense records."
              : "Create a reusable category for budget and expense records."}
            </DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="grid min-w-0 grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FieldShell label="Category name">
                  <TextInput
                    defaultValue={category?.name ?? ""}
                    name="name"
                    placeholder="Home rent, grocery, savings"
                  />
                </FieldShell>
              </div>
              <FieldShell label="Color">
                <SelectInput defaultValue={category?.color ?? "teal"} name="color">
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectInput>
              </FieldShell>
              <FieldShell label="Status">
                <SelectInput
                  defaultValue={category?.categoryStatus ?? (category?.isActive === false ? "blocked" : "active")}
                  name="status"
                >
                  <option value="active">Active</option>
                  <option value="pushed">Pushed</option>
                  <option value="blocked">Blocked</option>
                </SelectInput>
              </FieldShell>
              <div className="md:col-span-2">
                <FieldShell label="Note" hint="Optional details for this category.">
                  <TextArea
                    className="min-h-28"
                    defaultValue={category?.note ?? ""}
                    name="note"
                    placeholder="Where this category will be used"
                  />
                </FieldShell>
              </div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 md:col-span-2">
                <p className="text-sm font-medium text-emerald-600">Used across</p>
                <p className="mt-1 text-xl font-semibold text-slate-800">Budget and expenses</p>
                <p className="mt-1 text-sm text-slate-500">
                  Category names created here will be available in budget and expense forms.
                </p>
              </div>
              {error && <p className="text-sm font-medium text-red-500 md:col-span-2">{error}</p>}
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 px-4 py-3">
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button
              icon={
                isEdit ? (
                  <Pencil aria-hidden="true" className="size-4" />
                ) : (
                  <Plus aria-hidden="true" className="size-4" />
                )
              }
              type="submit"
            >
              {isEdit ? "Update Category" : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
