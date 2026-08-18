"use client";

import { CalendarDays, FileText, Target, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BudgetCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type BudgetStatus = "active" | "paused" | "completed";

type ViewBudgetModalProps = {
  budget?: BudgetCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

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

function DetailTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof WalletCards;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-white text-emerald-600 shadow-sm">
        <Icon aria-hidden="true" className="size-4" />
      </div>
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function ViewBudgetModal({ budget, open, onOpenChange }: ViewBudgetModalProps) {
  const status = budget ? getBudgetStatus(budget) : "active";

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="flex h-[82vh] !w-[min(92vw,760px)] max-w-none grid-rows-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-4 py-3">
          <DialogTitle>{budget?.name ?? "Budget Details"}</DialogTitle>
          <DialogDescription>Review target, date range, status, and saved notes.</DialogDescription>
        </DialogHeader>
        {budget && (
          <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-emerald-100 bg-emerald-50 p-4">
              <span className="text-lg font-semibold text-slate-950">{budget.name}</span>
              <Badge tone={budget.color as "teal" | "amber" | "rose" | "indigo"}>{budget.type}</Badge>
              <Badge tone={status === "active" ? "teal" : status === "paused" ? "amber" : "indigo"}>
                {statusLabels[status]}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DetailTile icon={Target} label="Target Price" value={formatCurrency(budget.monthlyLimit)} />
              <DetailTile icon={CalendarDays} label="Date Range" value={formatDateRange(budget)} />
              <DetailTile icon={WalletCards} label="Budget Type" value={budget.type} />
              <DetailTile icon={FileText} label="Status" value={statusLabels[status]} />
            </div>

            <div className="mt-4 rounded-md border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Note</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{budget.note || "-"}</p>
            </div>

            {budget.extraNote && (
              <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Extra Note</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{budget.extraNote}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
