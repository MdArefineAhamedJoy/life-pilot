"use client";

import Link from "next/link";
import { ExpenseTable } from "@/components/budget/expense-table";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Card } from "@/components/ui/card";
import { FieldShell, SelectInput, TextInput } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";

export default function ExpensesPage() {
  const { categories, expenses } = useLifeOs();

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Expenses"
          title="Expense list"
          description="Search, filter, and review item, category, payment, amount, and date."
        />
        <Link
          className="inline-flex min-h-11 w-full max-w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-emerald-600 sm:w-auto"
          href="/add-expense"
        >
          Add Expense
        </Link>
      </div>
      <Card title="Filters" eyebrow="Find expenses">
        <div className="grid min-w-0 gap-4 md:grid-cols-4">
          <FieldShell label="Search">
            <TextInput placeholder="Milk, transport, baby food" />
          </FieldShell>
          <FieldShell label="Date">
            <TextInput type="date" />
          </FieldShell>
          <FieldShell label="Category">
            <SelectInput>
              <option>All categories</option>
              {categories.map((category) => (
                <option key={category.id}>{category.name}</option>
              ))}
            </SelectInput>
          </FieldShell>
          <FieldShell label="Payment">
            <SelectInput>
              <option>All payments</option>
              <option>Cash</option>
              <option>Card</option>
              <option>Mobile banking</option>
            </SelectInput>
          </FieldShell>
        </div>
      </Card>
      <Card title="Expense Table" eyebrow="Records">
        <ExpenseTable expenses={expenses} />
      </Card>
    </div>
  );
}
