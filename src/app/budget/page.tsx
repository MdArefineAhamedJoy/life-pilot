"use client";

import { Eye, MoreVertical, Pencil, Plus, RefreshCcw, WalletCards } from "lucide-react";
import { useState } from "react";
import { BudgetModal } from "@/app/budget/components/budget-modal";
import { ViewBudgetModal } from "@/app/budget/components/view-budget-modal";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { DataTable, type TableColumn } from "@/components/shared/data-table";
import { StatCard } from "@/components/shared/card";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { getBudgetUsage, getTotalSpent } from "@/lib/calculations";
import type { BudgetCategory } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type BudgetStatus = "active" | "paused" | "completed";
type BudgetModalMode = "create" | "edit";
type BudgetUsage = ReturnType<typeof getBudgetUsage>[number];

const statusLabels: Record<BudgetStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};

function getBudgetStatus(category: BudgetCategory): BudgetStatus {
  return category.status ?? (category.isActive ? "active" : "paused");
}

function formatDateRange(category: BudgetCategory) {
  if (!category.startDate && !category.endDate) {
    return "-";
  }

  return `${category.startDate || "No start"} to ${category.endDate || "No end"}`;
}

function getNextBudgetStatus(status: BudgetStatus): BudgetStatus {
  if (status === "active") {
    return "paused";
  }

  if (status === "paused") {
    return "completed";
  }

  return "active";
}

export default function BudgetPage() {
  const { categories, expenses, updateBudgetCategory } = useLifeOs();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetModalMode, setBudgetModalMode] = useState<BudgetModalMode>("create");
  const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | undefined>();
  const [viewBudget, setViewBudget] = useState<BudgetCategory | undefined>();
  const [statusChangeBudget, setStatusChangeBudget] = useState<BudgetCategory | undefined>();
  const [openActionMenuId, setOpenActionMenuId] = useState<string | undefined>();
  const budgetUsage = getBudgetUsage(categories, expenses);
  const totalBudget = budgetUsage.reduce((total, category) => total + category.monthlyLimit, 0);
  const totalSpent = budgetUsage.reduce((total, category) => total + category.spent, 0);
  const todaySpent = getTotalSpent(expenses.filter((expense) => expense.date === "2026-08-05"));
  const totalActiveBudget = categories
    .filter((category) => getBudgetStatus(category) === "active")
    .reduce((total, category) => total + category.monthlyLimit, 0);
  const usageProgress = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const columns: TableColumn<BudgetUsage>[] = [
    {
      key: "category",
      header: "Category",
      render: (category) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{category.name}</p>
          {category.extraNote && <p className="mt-1 max-w-[240px] truncate text-xs text-slate-500">{category.extraNote}</p>}
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
      render: (category) => <span className="text-slate-600">{formatDateRange(category)}</span>,
    },
    {
      key: "target",
      header: "Target Price",
      render: (category) => <span className="font-medium text-slate-900">{formatCurrency(category.monthlyLimit)}</span>,
      align: "right",
    },
    {
      key: "spent",
      header: "Spent",
      render: (category) => <span className="font-mono text-slate-700">{formatCurrency(category.spent)}</span>,
      align: "right",
    },
    {
      key: "remaining",
      header: "Remaining",
      render: (category) => (
        <span className={cn("font-mono font-semibold", category.isOverBudget ? "text-red-500" : "text-emerald-600")}>
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
            tone={category.isOverBudget ? "rose" : (category.color as "teal" | "amber" | "rose" | "indigo")}
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
            {statusLabels[status]}
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
            onClick={() => setOpenActionMenuId((current) => (current === category.id ? undefined : category.id))}
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
                  setBudgetModalMode("edit");
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
            setBudgetModalMode("create");
            setIsBudgetModalOpen(true);
          }}
          type="button"
        >
          Create Budget
        </Button>
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          detail={`${formatCurrency(totalBudget - totalSpent)} remaining`}
          icon={WalletCards}
          label="Total budget use"
          progress={usageProgress}
          tone="emerald"
          value={formatCurrency(totalSpent)}
        />
        <StatCard
          detail="Tracked for today"
          icon={WalletCards}
          label="Today spent"
          progress={totalBudget > 0 ? Math.round((todaySpent / totalBudget) * 100) : 0}
          tone="red"
          value={formatCurrency(todaySpent)}
        />
        <StatCard
          detail={`${categories.length} categories tracked`}
          icon={WalletCards}
          label="Total budget"
          progress={totalBudget > 0 ? Math.round((totalActiveBudget / totalBudget) * 100) : 0}
          tone="blue"
          value={formatCurrency(totalBudget)}
        />
      </div>
      <DataTable
        columns={columns}
        emptyMessage="No budget categories yet."
        getRowKey={(category) => category.id}
        rows={budgetUsage}
      />
      <BudgetModal
        budget={selectedBudget}
        mode={budgetModalMode}
        onOpenChange={setIsBudgetModalOpen}
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
            ? `This will change "${statusChangeBudget.name}" from ${statusLabels[getBudgetStatus(statusChangeBudget)]} to ${statusLabels[getNextBudgetStatus(getBudgetStatus(statusChangeBudget))]}.`
            : "This will change the selected budget status."
        }
        onConfirm={() => {
          if (!statusChangeBudget) {
            return;
          }

          const status = getNextBudgetStatus(getBudgetStatus(statusChangeBudget));
          const { id, ...nextCategory } = statusChangeBudget;

          updateBudgetCategory(id, {
            ...nextCategory,
            status,
            isActive: status === "active",
          });
          setStatusChangeBudget(undefined);
        }}
        onOpenChange={(open) => !open && setStatusChangeBudget(undefined)}
        open={Boolean(statusChangeBudget)}
        title="Change Budget Status"
      />
    </div>
  );
}
