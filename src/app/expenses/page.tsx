"use client";

import { Receipt, TrendingUp, Wallet, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AddExpenseDialog } from "@/components/budget/add-expense-dialog";
import { ExpenseTable } from "@/components/budget/expense-table";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldShell, SelectInput, TextInput } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";

export default function ExpensesPage() {
  const { categories, expenses } = useLifeOs();

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("All categories");
  const [payment, setPayment] = useState("All payments");

  const hasActiveFilters =
    search !== "" || date !== "" || category !== "All categories" || payment !== "All payments";

  const clearFilters = () => {
    setSearch("");
    setDate("");
    setCategory("All categories");
    setPayment("All payments");
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        search.trim() === "" ||
        expense.itemName.toLowerCase().includes(search.trim().toLowerCase());
      const matchesDate = date === "" || expense.date === date;
      const matchesCategory = category === "All categories" || expense.category === category;
      const matchesPayment = payment === "All payments" || expense.paymentMethod === payment;
      return matchesSearch && matchesDate && matchesCategory && matchesPayment;
    });
  }, [expenses, search, date, category, payment]);

  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
    const count = filteredExpenses.length;
    const avg = count > 0 ? total / count : 0;
    return { total, count, avg };
  }, [filteredExpenses]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Expenses"
          title="Expense list"
          description="Search, filter, and review item, category, payment, amount, and date."
        />
        <AddExpenseDialog categories={categories} />
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <Wallet aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Total spent</p>
            <p className="truncate text-lg font-semibold text-slate-900">
              {stats.total.toLocaleString(undefined, { style: "currency", currency: "BDT" })}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <Receipt aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Transactions</p>
            <p className="truncate text-lg font-semibold text-slate-900">{stats.count}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <TrendingUp aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Average / entry</p>
            <p className="truncate text-lg font-semibold text-slate-900">
              {stats.avg.toLocaleString(undefined, { style: "currency", currency: "BDT" })}
            </p>
          </div>
        </Card>
      </div>

      <Card title="Filters" eyebrow="Find expenses">
        <div className="grid min-w-0 gap-4 md:grid-cols-4">
          <FieldShell label="Search">
            <TextInput
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Milk, transport, baby food"
              value={search}
            />
          </FieldShell>
          <FieldShell label="Date">
            <TextInput onChange={(e) => setDate(e.target.value)} type="date" value={date} />
          </FieldShell>
          <FieldShell label="Category">
            <SelectInput onChange={(e) => setCategory(e.target.value)} value={category}>
              <option>All categories</option>
              {categories.map((cat) => (
                <option key={cat.id}>{cat.name}</option>
              ))}
            </SelectInput>
          </FieldShell>
          <FieldShell label="Payment">
            <SelectInput onChange={(e) => setPayment(e.target.value)} value={payment}>
              <option>All payments</option>
              <option>Cash</option>
              <option>Card</option>
              <option>Mobile banking</option>
            </SelectInput>
          </FieldShell>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              Showing <span className="font-medium text-slate-700">{filteredExpenses.length}</span> of{" "}
              {expenses.length} expenses
            </p>
            <Button
              className="text-slate-500 hover:text-slate-700"
              icon={<X aria-hidden="true" className="size-3.5" />}
              onClick={clearFilters}
              type="button"
              variant="ghost"
            >
              Clear filters
            </Button>
          </div>
        )}
      </Card>

      <Card title="Expense Table" eyebrow="Records">
        {filteredExpenses.length > 0 ? (
          <ExpenseTable expenses={filteredExpenses} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Receipt aria-hidden="true" className="size-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No expenses match your filters</p>
            <p className="text-xs text-slate-400">Try adjusting search, date, category, or payment.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
