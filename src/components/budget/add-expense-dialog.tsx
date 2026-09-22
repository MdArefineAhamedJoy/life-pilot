"use client";
import { useFormatCurrency } from "@/hooks/use-format-currency";

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
import { localDateKey } from "@/lib/utils";
import { categoriesService } from "@/services/categories.service";
import { expensesService } from "@/services/expenses.service";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type AddExpenseDialogProps = {
  onSaved: () => void;
};

export function AddExpenseDialog({ onSaved }: AddExpenseDialogProps) {
  const formatCurrency = useFormatCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [error, setError] = useState("");
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const previewTotal = useMemo(() => {
    const parsedAmount = Number(amount) || 0;
    const parsedQuantity = Number(quantity) || 1;
    return parsedAmount * parsedQuantity;
  }, [amount, quantity]);

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

    if (!category) {
      setError("Choose an expense category before saving.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await expensesService.create({
        date: String(data.get("date") || localDateKey()),
        itemName: String(data.get("itemName") ?? ""),
        category,
        amount: previewTotal,
        quantity: Number(data.get("quantity")) || 1,
        unit: String(data.get("unit") ?? ""),
        paymentMethod: String(data.get("paymentMethod") ?? ""),
        note: String(data.get("note") ?? ""),
        sourceType: "manual",
      });
      setAmount("0");
      setQuantity("1");
      setCategory("");
      form.reset();
      setIsOpen(false);
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to save expense.");
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
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] !w-[min(92vw,760px)] max-w-none grid-rows-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-5 py-4">
          <DialogTitle>Manual Expense Entry</DialogTitle>
          <DialogDescription>Add cost details and save the record.</DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="grid min-w-0 grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <FieldShell label="Item name">
                <TextInput name="itemName" placeholder="Enter an item name" required />
              </FieldShell>
              <FieldShell label="Date">
                <TextInput defaultValue={localDateKey()} name="date" type="date" required />
              </FieldShell>
              <FieldShell label="Category">
                {isCategoriesLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <SelectInput
                    aria-invalid={Boolean(error && !category)}
                    disabled={isSaving}
                    name="category"
                    onChange={(event) => {
                      setCategory(event.target.value);
                      if (error) setError("");
                    }}
                    required
                    value={category}
                  >
                    <option disabled value="">
                      Choose a category
                    </option>
                    <option value="Uncategorized">Uncategorized</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </SelectInput>
                )}
              </FieldShell>
              <FieldShell label="Unit price">
                <TextInput
                  min="0"
                  name="amount"
                  onChange={(event) => setAmount(event.target.value)}
                  type="number"
                  value={amount}
                />
              </FieldShell>
              <FieldShell label="Quantity">
                <TextInput
                  min="1"
                  name="quantity"
                  onChange={(event) => setQuantity(event.target.value)}
                  type="number"
                  value={quantity}
                />
              </FieldShell>
              <FieldShell label="Unit">
                <TextInput name="unit" placeholder="kg, pack, bag" />
              </FieldShell>
              <FieldShell label="Payment method">
                <SelectInput name="paymentMethod">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile banking">Mobile banking</option>
                </SelectInput>
              </FieldShell>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-600">Auto total</p>
                <p className="mt-1 text-2xl font-semibold text-slate-800">
                  {formatCurrency(previewTotal)}
                </p>
              </div>
              <div className="md:col-span-2">
                <FieldShell label="Note">
                  <TextArea className="min-h-20" name="note" placeholder="Optional details" />
                </FieldShell>
              </div>
              {error && (
                <p
                  className="md:col-span-2 -mt-1 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
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
                {isSaving ? "Saving..." : "Save expense"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
