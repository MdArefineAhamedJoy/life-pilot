"use client";

import { Pencil, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import type { BudgetCategory } from "@/lib/types";

type CategoryStatus = "active" | "pushed" | "blocked";
type CategoryModalProps = { open: boolean; onOpenChange: (open: boolean) => void; category?: BudgetCategory };

const legacyColorMap: Record<string, string> = {
  teal: "#0f766e", amber: "#d97706", rose: "#e11d48", indigo: "#4f46e5",
};

function colorValue(color?: string) {
  return /^#[0-9a-f]{6}$/i.test(color ?? "") ? color! : (legacyColorMap[color ?? ""] ?? "#0f766e");
}

export function CategoryModal({ open, onOpenChange, category }: CategoryModalProps) {
  const { addBudgetCategory, categories, updateBudgetCategory } = useLifeOs();
  const [error, setError] = useState("");
  const [color, setColor] = useState(colorValue(category?.color));
  const isEdit = Boolean(category);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const status = isEdit ? (String(data.get("status") ?? "active") as CategoryStatus) : "active";
    const subcategories = String(data.get("subcategories") ?? "").split(/[,\n]/).map((item) => item.trim()).filter(Boolean);

    if (!name) return setError("Category name is required.");
    if (categories.some((item) => item.id !== category?.id && item.name.toLowerCase() === name.toLowerCase())) {
      return setError("This category already exists.");
    }

    const nextCategory: Omit<BudgetCategory, "id"> = {
      name,
      subcategories,
      color,
      type: String(data.get("type") ?? category?.type ?? "monthly") as BudgetCategory["type"],
      monthlyLimit: Number(data.get("monthlyLimit")) || 0,
      weeklyLimit: category?.weeklyLimit ?? 0,
      dailyLimit: category?.dailyLimit ?? 0,
      startDate: category?.startDate ?? "",
      endDate: category?.endDate ?? "",
      status: category?.status,
      categoryStatus: status,
      isActive: status === "active",
      note: String(data.get("note") ?? "").trim(),
      extraNote: String(data.get("extraNote") ?? "").trim(),
    };
    const saved = category
      ? await updateBudgetCategory(category.id, nextCategory)
      : await addBudgetCategory(nextCategory);
    if (!saved) return;
    setError("");
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={(nextOpen) => { onOpenChange(nextOpen); if (!nextOpen) setError(""); }} open={open}>
      <DialogContent className="!flex h-[82vh] !w-[min(92vw,760px)] max-w-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-4 py-3">
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the category, subcategories, colour, and status." : "Create a reusable category. New categories are active by default."}</DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto pr-2">
            <div className="grid min-w-0 grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FieldShell label="Category name">
                  <TextInput defaultValue={category?.name ?? ""} name="name" placeholder="Grocery, Electricity, Baby care" required />
                </FieldShell>
              </div>
              <FieldShell label="Subcategories">
                  <TextInput defaultValue={(category?.subcategories ?? []).join(", ")} name="subcategories" placeholder="Vegetables, baby food, clothing" />
              </FieldShell>
              <FieldShell label="Category color">
                <div className="flex h-9 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15">
                  <input aria-label="Pick any category color" className="h-full w-14 cursor-pointer border-0 bg-transparent p-1" onChange={(event) => setColor(event.target.value)} type="color" value={color} />
                  <span className="flex flex-1 items-center border-l border-slate-200 px-3 font-mono text-sm text-slate-600">{color.toUpperCase()}</span>
                </div>
              </FieldShell>
              <FieldShell label="Budget period">
                <SelectInput defaultValue={category?.type ?? "monthly"} name="type">
                  <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
                </SelectInput>
              </FieldShell>
              <FieldShell label="Budget limit">
                <TextInput defaultValue={category?.monthlyLimit || ""} min="0" name="monthlyLimit" placeholder="0" step="0.01" type="number" />
              </FieldShell>
              {isEdit && (
                <FieldShell label="Status">
                  <SelectInput defaultValue={category?.categoryStatus ?? (category?.isActive === false ? "blocked" : "active")} name="status">
                    <option value="active">Active</option><option value="pushed">Pushed</option><option value="blocked">Blocked</option>
                  </SelectInput>
                </FieldShell>
              )}
              <div className={isEdit ? "" : "md:col-span-2"}>
                <FieldShell label="Description">
                  <TextArea className="min-h-24" defaultValue={category?.note ?? ""} name="note" placeholder="What should be recorded here?" />
                </FieldShell>
              </div>
              <div className="md:col-span-2">
                <FieldShell label="Additional details">
                  <TextArea className="min-h-20" defaultValue={category?.extraNote ?? ""} name="extraNote" placeholder="Example: Keep receipts for warranty items." />
                </FieldShell>
              </div>
              {error && <p className="text-sm font-medium text-red-500 md:col-span-2">{error}</p>}
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 px-4 py-3">
            <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <Button onClick={() => onOpenChange(false)} type="button" variant="outline">Cancel</Button>
              <Button icon={isEdit ? <Pencil aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />} type="submit">
                {isEdit ? "Update Category" : "Add Category"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
