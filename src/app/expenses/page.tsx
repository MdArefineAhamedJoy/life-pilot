"use client";

import { CalendarDays, CreditCard, Receipt, Search, Tags, TrendingUp, Wallet, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AddExpenseDialog } from "@/components/budget/add-expense-dialog";
import { ExpenseTable } from "@/components/budget/expense-table";
import { SharedCard, StatCard } from "@/components/shared/card";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { SelectInput, TextInput } from "@/components/ui/field";
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
  const totalExpenseAmount = expenses.reduce((sum, expense) => sum + (expense.amount ?? 0), 0);

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

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          detail={`${filteredExpenses.length} matching entries`}
          icon={Wallet}
          label="Total spent"
          progress={totalExpenseAmount > 0 ? Math.round((stats.total / totalExpenseAmount) * 100) : 0}
          tone="red"
          value={stats.total.toLocaleString(undefined, { style: "currency", currency: "BDT" })}
        />
        <StatCard
          detail={`of ${expenses.length} total records`}
          icon={Receipt}
          label="Transactions"
          progress={expenses.length > 0 ? Math.round((stats.count / expenses.length) * 100) : 0}
          tone="blue"
          value={String(stats.count)}
        />
        <StatCard
          detail="Average per filtered entry"
          icon={TrendingUp}
          label="Average / entry"
          progress={stats.total > 0 ? Math.min(Math.round((stats.avg / stats.total) * 100), 100) : 0}
          tone="emerald"
          value={stats.avg.toLocaleString(undefined, { style: "currency", currency: "BDT" })}
        />
      </div>

      <SharedCard className="!p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-emerald-600">Filters</p>
            <h2 className="mt-1 truncate text-lg font-semibold text-slate-950">Find expenses</h2>
          </div>
          {hasActiveFilters && (
            <Button
              className="w-full text-slate-500 hover:text-slate-700 sm:w-auto"
              icon={<X aria-hidden="true" className="size-3.5" />}
              onClick={clearFilters}
              type="button"
              variant="ghost"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="grid min-w-0 gap-4 p-5 md:grid-cols-4">
          <label className="block min-w-0 space-y-2">
            <span className="text-sm font-semibold text-slate-700">Search</span>
            <span className="relative block">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />
              <TextInput
                className="h-11 bg-white pl-10"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Milk, transport, baby food"
                value={search}
              />
            </span>
          </label>
          <label className="block min-w-0 space-y-2">
            <span className="text-sm font-semibold text-slate-700">Date</span>
            <span className="relative block">
              <CalendarDays
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />
              <TextInput
                className="h-11 bg-white pl-10"
                onChange={(e) => setDate(e.target.value)}
                type="date"
                value={date}
              />
            </span>
          </label>
          <label className="block min-w-0 space-y-2">
            <span className="text-sm font-semibold text-slate-700">Category</span>
            <span className="relative block">
              <Tags
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />
              <SelectInput
                className="h-11 bg-white pl-10"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option>All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id}>{cat.name}</option>
                ))}
              </SelectInput>
            </span>
          </label>
          <label className="block min-w-0 space-y-2">
            <span className="text-sm font-semibold text-slate-700">Payment</span>
            <span className="relative block">
              <CreditCard
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />
              <SelectInput
                className="h-11 bg-white pl-10"
                onChange={(e) => setPayment(e.target.value)}
                value={payment}
              >
                <option>All payments</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Mobile banking</option>
              </SelectInput>
            </span>
          </label>
        </div>
        {hasActiveFilters && (
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filteredExpenses.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{expenses.length}</span> expenses
          </div>
        )}
      </SharedCard>

      <ExpenseTable expenses={filteredExpenses} />
    </div>
  );
}
