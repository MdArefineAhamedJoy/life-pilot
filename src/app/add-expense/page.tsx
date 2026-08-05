"use client";

import { ExpenseForm } from "@/components/budget/expense-form";
import { ExpenseTable } from "@/components/budget/expense-table";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export default function AddExpensePage() {
  const { categories, expenses } = useLifeOs();

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Add expense"
        title="Fast manual entry"
        description="Add bajar, personal, baby, and recurring costs with automatic total calculation."
      />
      <ExpenseForm categories={categories} />
      <Card title="Latest Expenses" eyebrow="Saved">
        <ExpenseTable expenses={expenses.slice(0, 8)} />
      </Card>
    </div>
  );
}
