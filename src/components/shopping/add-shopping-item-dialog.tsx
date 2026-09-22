"use client";

import { Skeleton } from "@/components/shared/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import type { BudgetCategory } from "@/lib/types";
import { categoriesService } from "@/services/categories.service";
import { shoppingService } from "@/services/shopping.service";
import { Plus } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type AddShoppingItemDialogProps = { onSaved: () => void };

export function AddShoppingItemDialog({ onSaved }: AddShoppingItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [error, setError] = useState("");
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function loadCategories() {
      setIsCategoriesLoading(true);
      setError("");
      try {
        setCategories(await categoriesService.list());
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to load categories.");
      } finally {
        setIsCategoriesLoading(false);
      }
    }
    void loadCategories();
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setIsSaving(true);
    setError("");
    try {
      await shoppingService.create({
        name: String(data.get("name") ?? ""),
        category: category || undefined,
        quantity: Number(data.get("quantity")) || undefined,
        unit: String(data.get("unit") ?? ""),
        estimatedPrice: Number(data.get("estimatedPrice")) || 0,
        status: "pending",
        note: String(data.get("note") ?? ""),
      });
      form.reset();
      setCategory("");
      setIsOpen(false);
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to add shopping item.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full shadow-sm transition-shadow hover:shadow-md sm:w-auto"
          icon={<Plus aria-hidden="true" className="size-4" />}
          type="button"
        >
          Add item
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] !w-[min(92vw,680px)] max-w-none grid-rows-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-5 py-4">
          <DialogTitle>Add shopping item</DialogTitle>
          <DialogDescription>Keep the item ready until you buy it.</DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldShell label="Item name">
                  <TextInput name="name" placeholder="Rice, milk, detergent" required />
                </FieldShell>
              </div>
              <FieldShell label="Category">
                {isCategoriesLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <SelectInput
                    disabled={isSaving}
                    name="category"
                    onChange={(event) => setCategory(event.target.value)}
                    value={category}
                  >
                    <option value="">No category</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </SelectInput>
                )}
              </FieldShell>
              <FieldShell label="Estimated total">
                <TextInput
                  min="0"
                  name="estimatedPrice"
                  placeholder="0"
                  step="0.01"
                  type="number"
                />
              </FieldShell>
              <FieldShell label="Quantity">
                <TextInput min="1" name="quantity" placeholder="1" step="0.01" type="number" />
              </FieldShell>
              <FieldShell label="Unit">
                <TextInput name="unit" placeholder="kg, pack, piece" />
              </FieldShell>
              <div className="sm:col-span-2">
                <FieldShell label="Note">
                  <TextArea className="min-h-20" name="note" placeholder="Optional details" />
                </FieldShell>
              </div>
              {error && (
                <p
                  className="sm:col-span-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 px-5 py-3">
            <div>
              <Button
                disabled={isSaving}
                onClick={() => setIsOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isSaving || isCategoriesLoading} type="submit">
                {isSaving ? "Adding..." : "Add item"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
