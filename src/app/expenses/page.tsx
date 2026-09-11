"use client";

import { AddExpenseDialog } from "@/components/budget/add-expense-dialog";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { DataTable, type TableColumn } from "@/components/shared/data-table";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { StatCard } from "@/components/shared/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectInput, TextInput } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import type { BudgetCategory } from "@/lib/types";
import { categoriesService } from "@/services/categories.service";
import { expensesService } from "@/services/expenses.service";
import type { Expense, ExpenseSummary } from "@/types/expense.types";
import { MoreVertical, Receipt, TrendingUp, Trash2, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";

type PaginationMeta = {
  page: number;
  totalPages: number;
};

export default function ExpensesPage() {
  const formatCurrency = useFormatCurrency();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, totalPages: 1 });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [deleteExpense, setDeleteExpense] = useState<Expense | undefined>();
  const [openActionMenuId, setOpenActionMenuId] = useState<string | undefined>();
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategories(await categoriesService.list());
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to load categories.");
      } finally {
        setIsCategoriesLoading(false);
      }
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    async function loadExpenses() {
      setIsLoading(true);
      setError("");

      try {
        const filters = {
          search: search || undefined,
          date: date || undefined,
          category: category || undefined,
          paymentMethod: paymentMethod || undefined,
        };
        const [response, summaryResponse] = await Promise.all([
          expensesService.list({ page, limit: pageSize, ...filters }),
          expensesService.getSummary(filters),
        ]);
        setExpenses(response.data);
        setMeta(response.meta ?? { page, totalPages: 1 });
        setSummary(summaryResponse.data);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to load expenses.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadExpenses();
  }, [category, date, page, pageSize, paymentMethod, reloadVersion, search]);

  if (isLoading || isCategoriesLoading) {
    return <PageSkeleton filterCount={4} tableColumnCount={7} />;
  }

  const hasActiveFilters = Boolean(search || date || category || paymentMethod);
  const clearFilters = () => {
    setSearch("");
    setDate("");
    setCategory("");
    setPaymentMethod("");
    setPage(1);
  };

  async function handleDelete() {
    if (!deleteExpense) return false;

    try {
      await expensesService.remove(deleteExpense.id);
      setReloadVersion((current) => current + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to delete expense.");
      return false;
    }
  }

  const columns: TableColumn<Expense>[] = [
    { key: "date", header: "Date", render: (expense) => expense.date },
    {
      key: "item",
      header: "Item",
      render: (expense) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{expense.itemName}</p>
          {expense.note && (
            <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">{expense.note}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (expense) => <Badge>{expense.category}</Badge>,
    },
    { key: "payment", header: "Payment", render: (expense) => expense.paymentMethod || "-" },
    { key: "source", header: "Source", render: (expense) => expense.sourceType },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (expense) => (
        <span className="font-mono font-medium">{formatCurrency(expense.amount)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (expense) => (
        <div className="relative flex justify-end">
          <button
            aria-expanded={openActionMenuId === expense.id}
            aria-label={`Open actions for ${expense.itemName}`}
            className="flex size-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            onClick={() =>
              setOpenActionMenuId((current) => (current === expense.id ? undefined : expense.id))
            }
            type="button"
          >
            <MoreVertical aria-hidden="true" className="size-4" />
          </button>
          {openActionMenuId === expense.id && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
              <button
                className="flex min-h-10 w-full items-center gap-3 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-red-600"
                onClick={() => {
                  setDeleteExpense(expense);
                  setOpenActionMenuId(undefined);
                }}
                type="button"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Delete expense
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Expenses"
          title="Expense list"
          description="Search, filter, and review item, category, payment, amount, and date."
        />
        <AddExpenseDialog onSaved={() => setReloadVersion((current) => current + 1)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          detail={`${summary?.transactionCount ?? 0} matching entries`}
          icon={Wallet}
          label="Total spent"
          progress={
            summary?.totalRecordCount
              ? Math.round(((summary.transactionCount ?? 0) / summary.totalRecordCount) * 100)
              : 0
          }
          tone="red"
          value={formatCurrency(summary?.totalAmount ?? 0)}
        />
        <StatCard
          detail={`of ${summary?.totalRecordCount ?? 0} total records`}
          icon={Receipt}
          label="Transactions"
          progress={
            summary?.totalRecordCount
              ? Math.round(((summary.transactionCount ?? 0) / summary.totalRecordCount) * 100)
              : 0
          }
          tone="blue"
          value={String(summary?.transactionCount ?? 0)}
        />
        <StatCard
          detail="Average per matching entry"
          icon={TrendingUp}
          label="Average / entry"
          progress={summary?.transactionCount ? 100 : 0}
          tone="emerald"
          value={formatCurrency(summary?.averageAmount ?? 0)}
        />
      </div>
      {error && (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4">
        <TextInput
          aria-label="Search expenses"
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Milk, transport, baby food"
          value={search}
        />
        <TextInput
          aria-label="Filter by date"
          onChange={(event) => {
            setDate(event.target.value);
            setPage(1);
          }}
          type="date"
          value={date}
        />
        <SelectInput
          aria-label="Filter by category"
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          value={category}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          aria-label="Filter by payment method"
          onChange={(event) => {
            setPaymentMethod(event.target.value);
            setPage(1);
          }}
          value={paymentMethod}
        >
          <option value="">All payments</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Mobile banking">Mobile banking</option>
        </SelectInput>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span>Filters are applied on the server.</span>
          <Button
            icon={<X aria-hidden="true" className="size-3.5" />}
            onClick={clearFilters}
            type="button"
            variant="ghost"
          >
            Clear
          </Button>
        </div>
      )}
      <DataTable
        columns={columns}
        emptyMessage="No expenses yet."
        getRowKey={(expense) => expense.id}
        paginated={false}
        rows={expenses}
        serverPagination={{ page: meta.page, totalPages: meta.totalPages, onPageChange: setPage }}
      />
      <ConfirmationModal
        actionLabel="Delete expense"
        cancelLabel="Cancel"
        description={
          deleteExpense
            ? `This permanently deletes "${deleteExpense.itemName}". This action cannot be undone.`
            : "This permanently deletes the selected expense."
        }
        onConfirm={handleDelete}
        onOpenChange={(open) => !open && setDeleteExpense(undefined)}
        open={Boolean(deleteExpense)}
        title="Delete Expense"
        variant="danger"
      />
    </div>
  );
}
