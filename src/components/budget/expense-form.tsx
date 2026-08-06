"use client";

import { useMemo, useState } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
import type { BudgetCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";

type ExpenseFormProps = {
  categories: BudgetCategory[];
};

export function ExpenseForm({ categories }: ExpenseFormProps) {
  const { addExpense } = useLifeOs();
  const [amount, setAmount] = useState("0");
  const [quantity, setQuantity] = useState("1");
  const [savedMessage, setSavedMessage] = useState("");

  const previewTotal = useMemo(() => {
    const parsedAmount = Number(amount) || 0;
    const parsedQuantity = Number(quantity) || 1;
    return parsedAmount * parsedQuantity;
  }, [amount, quantity]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    const itemName = String(data.get("itemName") ?? "");

    addExpense({
      date: String(data.get("date") ?? new Date().toISOString().slice(0, 10)),
      itemName,
      category: String(data.get("category") ?? ""),
      amount: previewTotal,
      quantity: Number(data.get("quantity")) || 1,
      unit: String(data.get("unit") ?? ""),
      paymentMethod: String(data.get("paymentMethod") ?? ""),
      note: String(data.get("note") ?? ""),
      sourceType: "manual",
    });

    setSavedMessage(`${itemName} saved: ${formatCurrency(previewTotal)}`);
    setAmount("0");
    setQuantity("1");
    form.reset();
  }

  return (
    <Card title="Manual Expense Entry" eyebrow="Add expense">
      <form className="grid min-w-0 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <FieldShell label="Item name">
          <TextInput name="itemName" placeholder="Fish, rice, baby wipes" required />
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
          <TextInput min="0" name="amount" onChange={(event) => setAmount(event.target.value)} type="number" value={amount} />
        </FieldShell>
        <FieldShell label="Quantity">
          <TextInput min="1" name="quantity" onChange={(event) => setQuantity(event.target.value)} type="number" value={quantity} />
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
        <div className="rounded-md border border-emerald-500/20 bg-emerald-50 p-3">
          <p className="text-sm font-medium text-emerald-600">Auto total</p>
          <p className="mt-1 text-2xl font-semibold text-slate-800">{formatCurrency(previewTotal)}</p>
        </div>
        <div className="md:col-span-2">
          <FieldShell label="Note">
            <TextArea name="note" placeholder="Optional details" />
          </FieldShell>
        </div>
        <div className="md:col-span-2">
          <Button className="w-full sm:w-auto" type="submit">Save expense</Button>
          {savedMessage && <p className="mt-2 text-sm font-medium text-green-500">{savedMessage}</p>}
        </div>
      </form>
    </Card>
  );
}
