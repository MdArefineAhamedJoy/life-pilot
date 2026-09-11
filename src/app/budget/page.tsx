"use client";
import { useFormatCurrency } from "@/hooks/use-format-currency";

import { BudgetModal } from "@/app/budget/components/budget-modal";
import { ViewBudgetModal } from "@/app/budget/components/view-budget-modal";
import { StatCard } from "@/components/shared/card";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { DataTable, type TableColumn } from "@/components/shared/data-table";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectInput, TextInput } from "@/components/ui/field";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import {
  budgetStatusLabels,
  getBudgetDateRange,
  getBudgetStatus,
  getNextBudgetStatus,
} from "@/lib/budget-utils";
import { budgetService } from "@/services/budget.service";
import type {
  Budget,
  BudgetStatus,
  BudgetSummary,
  BudgetType,
  BudgetUsage,
} from "@/types/budget.types";
import { Eye, MoreVertical, Pencil, Plus, RefreshCcw, Trash2, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";

type PaginationMeta = {
  page: number;
  totalPages: number;
};

export default function BudgetPage() {
  const formatCurrency = useFormatCurrency();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BudgetStatus | undefined>();
  const [type, setType] = useState<BudgetType | undefined>();
  const [budgets, setBudgets] = useState<BudgetUsage[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, totalPages: 1 });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>();
  const [viewBudget, setViewBudget] = useState<Budget | undefined>();
  const [statusChangeBudget, setStatusChangeBudget] = useState<Budget | undefined>();
  const [deleteBudget, setDeleteBudget] = useState<Budget | undefined>();
  const [openActionMenuId, setOpenActionMenuId] = useState<string | undefined>();
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    async function loadBudgets() {
      setIsLoading(true);
      setError("");

      try {
        const filters = { search: search || undefined, status, type };
        const response = await budgetService.list({ page, limit: pageSize, ...filters });
        const summaryResponse = await budgetService.getSummary(filters);
        setBudgets(response.data);
        setMeta(response.meta ?? { page, totalPages: 1 });
        setSummary(summaryResponse.data);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to load budgets.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadBudgets();
  }, [page, pageSize, reloadVersion, search, status, type]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  async function handleStatusChange() {
    if (!statusChangeBudget) {
      return false;
    }

    try {
      await budgetService.updateStatus(
        statusChangeBudget.id,
        getNextBudgetStatus(getBudgetStatus(statusChangeBudget))
      );
      setReloadVersion((current) => current + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to change budget status.");
      return false;
    }
  }

  async function handleDelete() {
    if (!deleteBudget) {
      return false;
    }

    try {
      await budgetService.remove(deleteBudget.id);
      setReloadVersion((current) => current + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to delete budget.");
      return false;
    }
  }

  const columns: TableColumn<BudgetUsage>[] = [
    {
      key: "budget",
      header: "Budget",
      render: (category) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{category.name}</p>
          {category.extraNote && (
            <p className="mt-1 max-w-[240px] truncate text-xs text-slate-500">
              {category.extraNote}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (category) => (
        <Badge tone={category.color as "teal" | "amber" | "rose" | "indigo"}>{category.type}</Badge>
      ),
    },
    {
      key: "dateRange",
      header: "Date Range",
      render: (category) => <span className="text-slate-600">{getBudgetDateRange(category)}</span>,
    },
    {
      key: "target",
      header: "Target Price",
      render: (category) => (
        <span className="font-medium text-slate-900">{formatCurrency(category.monthlyLimit)}</span>
      ),
      align: "right",
    },
    {
      key: "spent",
      header: "Spent",
      render: (category) => (
        <span className="font-mono text-slate-700">{formatCurrency(category.spent)}</span>
      ),
      align: "right",
    },
    {
      key: "remaining",
      header: "Remaining",
      render: (category) => (
        <span
          className={`font-mono font-semibold ${
            category.isOverBudget ? "text-red-500" : "text-emerald-600"
          }`}
        >
          {formatCurrency(category.remaining)}
        </span>
      ),
      align: "right",
    },
    {
      key: "usage",
      header: "Usage",
      render: (category) => (
        <div className="min-w-[180px]">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
            <span>{category.percent}% used</span>
            <span>{category.isOverBudget ? "Over" : "Available"}</span>
          </div>
          <ProgressBar
            tone={
              category.isOverBudget
                ? "rose"
                : (category.color as "teal" | "amber" | "rose" | "indigo")
            }
            value={category.percent}
          />
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (category) => {
        const status = getBudgetStatus(category);

        return (
          <Badge tone={status === "active" ? "teal" : status === "paused" ? "amber" : "indigo"}>
            {budgetStatusLabels[status]}
          </Badge>
        );
      },
    },
    {
      key: "note",
      header: "Note",
      render: (category) => (
        <span className="block max-w-[260px] truncate text-slate-600">{category.note || "-"}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (category) => (
        <div className="relative flex justify-end">
          <button
            aria-expanded={openActionMenuId === category.id}
            aria-label={`Open actions for ${category.name}`}
            className="flex size-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            onClick={() =>
              setOpenActionMenuId((current) => (current === category.id ? undefined : category.id))
            }
            type="button"
          >
            <MoreVertical aria-hidden="true" className="size-4" />
          </button>
          {openActionMenuId === category.id && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-48 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
              <button
                className="flex min-h-10 w-full items-center gap-3 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
                onClick={() => {
                  setSelectedBudget(category);
                  setIsBudgetModalOpen(true);
                  setOpenActionMenuId(undefined);
                }}
                type="button"
              >
                <Pencil aria-hidden="true" className="size-4" />
                Edit Budget
              </button>
              <button
                className="flex min-h-10 w-full items-center gap-3 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                onClick={() => {
                  setViewBudget(category);
                  setOpenActionMenuId(undefined);
                }}
                type="button"
              >
                <Eye aria-hidden="true" className="size-4" />
                View Budget
              </button>
              <button
                className="flex min-h-10 w-full items-center gap-3 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-amber-600"
                onClick={() => {
                  setStatusChangeBudget(category);
                  setOpenActionMenuId(undefined);
                }}
                type="button"
              >
                <RefreshCcw aria-hidden="true" className="size-4" />
                Status Change
              </button>
              <button
                className="flex min-h-10 w-full items-center gap-3 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-red-600"
                onClick={() => {
                  setDeleteBudget(category);
                  setOpenActionMenuId(undefined);
                }}
                type="button"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Delete Budget
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
          eyebrow="Budget"
          title="Budget and daily cost"
          description="Manage category limits, track bajar cost, and review total spending."
        />
        <Button
          className="w-full shadow-sm transition-shadow hover:shadow-md sm:w-auto"
          icon={<Plus aria-hidden="true" className="size-4" />}
          onClick={() => {
            setSelectedBudget(undefined);
            setIsBudgetModalOpen(true);
          }}
          type="button"
        >
          Create Budget
        </Button>
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          detail={`${formatCurrency(summary?.remaining ?? 0)} remaining`}
          icon={WalletCards}
          label="Total budget use"
          progress={summary?.usageProgress ?? 0}
          tone="emerald"
          value={formatCurrency(summary?.totalSpent ?? 0)}
        />
        <StatCard
          detail="Tracked for today"
          icon={WalletCards}
          label="Today spent"
          progress={summary?.todayUsageProgress ?? 0}
          tone="red"
          value={formatCurrency(summary?.todaySpent ?? 0)}
        />
        <StatCard
          detail={`${summary?.budgetCount ?? 0} budgets tracked`}
          icon={WalletCards}
          label="Total budget"
          progress={summary?.activeBudgetProgress ?? 0}
          tone="blue"
          value={formatCurrency(summary?.totalBudget ?? 0)}
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
      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-3">
        <TextInput
          aria-label="Search budgets"
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search budgets"
          value={search}
        />
        <SelectInput
          aria-label="Filter by status"
          onChange={(event) => {
            setStatus((event.target.value || undefined) as BudgetStatus | undefined);
            setPage(1);
          }}
          value={status ?? ""}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </SelectInput>
        <SelectInput
          aria-label="Filter by type"
          onChange={(event) => {
            setType((event.target.value || undefined) as BudgetType | undefined);
            setPage(1);
          }}
          value={type ?? ""}
        >
          <option value="">All types</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </SelectInput>
      </div>
      <DataTable
        columns={columns}
        emptyMessage={isLoading ? "Loading budgets..." : "No budgets yet."}
        getRowKey={(category) => category.id}
        paginated={false}
        rows={budgets}
        serverPagination={{ page: meta.page, totalPages: meta.totalPages, onPageChange: setPage }}
      />
      <BudgetModal
        budget={selectedBudget}
        mode={selectedBudget ? "edit" : "create"}
        onOpenChange={setIsBudgetModalOpen}
        onSaved={() => setReloadVersion((current) => current + 1)}
        open={isBudgetModalOpen}
      />
      <ViewBudgetModal
        budget={viewBudget}
        onOpenChange={(open) => !open && setViewBudget(undefined)}
        open={Boolean(viewBudget)}
      />
      <ConfirmationModal
        actionLabel="Change status"
        cancelLabel="Cancel"
        description={
          statusChangeBudget
            ? `This will change "${statusChangeBudget.name}" from ${budgetStatusLabels[getBudgetStatus(statusChangeBudget)]} to ${budgetStatusLabels[getNextBudgetStatus(getBudgetStatus(statusChangeBudget))]}.`
            : "This will change the selected budget status."
        }
        onConfirm={handleStatusChange}
        onOpenChange={(open) => !open && setStatusChangeBudget(undefined)}
        open={Boolean(statusChangeBudget)}
        title="Change Budget Status"
      />
      <ConfirmationModal
        actionLabel="Delete budget"
        cancelLabel="Cancel"
        description={
          deleteBudget
            ? `This permanently deletes "${deleteBudget.name}". This action cannot be undone.`
            : "This permanently deletes the selected budget."
        }
        onConfirm={handleDelete}
        onOpenChange={(open) => !open && setDeleteBudget(undefined)}
        open={Boolean(deleteBudget)}
        title="Delete Budget"
        variant="danger"
      />
    </div>
  );
}
