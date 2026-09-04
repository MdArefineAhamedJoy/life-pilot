"use client";

import { useLifeOs } from "@/components/state/life-os-provider";
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
import {
  FieldShell,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/ui/field";
import type { BudgetCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

type AddExpenseDialogProps = {
  categories: BudgetCategory[];
};

export function AddExpenseDialog({ categories }: AddExpenseDialogProps) {
  const { addExpense } = useLifeOs();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const [quantity, setQuantity] = useState("1");

  const previewTotal = useMemo(() => {
    const parsedAmount = Number(amount) || 0;
    const parsedQuantity = Number(quantity) || 1;
    return parsedAmount * parsedQuantity;
  }, [amount, quantity]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    addExpense({
      date: String(data.get("date") ?? new Date().toISOString().slice(0, 10)),
      itemName: String(data.get("itemName") ?? ""),
      category: String(data.get("category") ?? ""),
      amount: previewTotal,
      quantity: Number(data.get("quantity")) || 1,
      unit: String(data.get("unit") ?? ""),
      paymentMethod: String(data.get("paymentMethod") ?? ""),
      note: String(data.get("note") ?? ""),
      sourceType: "manual",
    });

    setAmount("0");
    setQuantity("1");
    form.reset();
    setIsOpen(false);
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
      <DialogContent className="flex h-[82vh] !w-[min(92vw,760px)] max-w-none grid-rows-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-4 py-2">
          <DialogTitle>Manual Expense Entry</DialogTitle>
          <DialogDescription>
            Add cost details and save the record.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex min-h-0 flex-1  flex-col overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="grid min-w-0 grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <FieldShell label="Item name">
                <TextInput
                  name="itemName"
                  placeholder="Enter an item name"
                  required
                />
              </FieldShell>
              <FieldShell label="Date">
                <TextInput name="date" type="date" />
              </FieldShell>
              <FieldShell label="Category">
                <SelectInput name="category">
                  {categories.map((category) => (
                    <option key={category.id}>{category.name}</option>
                  ))}
                </SelectInput>
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
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Mobile banking</option>
                </SelectInput>
              </FieldShell>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-600">
                  Auto total
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-800">
                  {formatCurrency(previewTotal)}
                </p>
              </div>
              <div className="md:col-span-2">
                <FieldShell label="Note">
                  <TextArea
                    className="min-h-20"
                    name="note"
                    placeholder="Optional details"
                  />
                </FieldShell>
              </div>
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 ">
           <div className="px-4 py-2">
             <Button
              onClick={() => setIsOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">Save expense</Button>
           </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
