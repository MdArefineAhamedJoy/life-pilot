"use client";

import { MoreVertical, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryModal } from "@/app/categories/components/category-modal";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { DataTable, type TableColumn } from "@/components/shared/data-table";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import type { BudgetCategory } from "@/lib/types";

type CategoryStatus = "active" | "pushed" | "blocked";

const statusLabels: Record<CategoryStatus, string> = {
  active: "Active",
  pushed: "Pushed",
  blocked: "Blocked",
};

const legacyColors: Record<string, string> = {
  teal: "#0f766e",
  amber: "#d97706",
  rose: "#e11d48",
  indigo: "#4f46e5",
};

function displayColor(color: string) {
  return /^#[0-9a-f]{6}$/i.test(color) ? color : (legacyColors[color] ?? "#0f766e");
}

function getCategoryStatus(category: BudgetCategory): CategoryStatus {
  return category.categoryStatus ?? (category.isActive ? "active" : "blocked");
}

export default function CategoriesPage() {
  const { categories, deleteBudgetCategory, expenses } = useLifeOs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | undefined>();
  const [deleteCategory, setDeleteCategory] = useState<BudgetCategory | undefined>();
  const [openActionMenuId, setOpenActionMenuId] = useState<string | undefined>();

  const expenseCountByCategory = useMemo(() => {
    return expenses.reduce<Record<string, number>>((counts, expense) => {
      counts[expense.category] = (counts[expense.category] ?? 0) + 1;
      return counts;
    }, {});
  }, [expenses]);

  const columns: TableColumn<BudgetCategory>[] = [
    {
      key: "category",
      header: "Category",
      render: (category) => (
        <div className="flex min-w-[180px] items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Tags aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">{category.name}</p>
            {category.subcategories.length > 0 && (
              <p className="mt-1 max-w-[360px] truncate text-xs text-slate-500">
                {category.subcategories.join(" · ")}
              </p>
            )}
            <p className="mt-1 max-w-[360px] truncate text-xs text-slate-500">
              {category.note || "Available for budget and expenses"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "color",
      header: "Color",
      render: (category) => (
        <span className="inline-flex items-center gap-2 text-sm text-slate-700">
          <span className="size-4 rounded-full border border-slate-300" style={{ backgroundColor: displayColor(category.color) }} />
          {displayColor(category.color).toUpperCase()}
        </span>
      ),
    },
    {
      key: "expenseCount",
      header: "Expense Records",
      render: (category) => (
        <span className="font-mono text-slate-700">
          {expenseCountByCategory[category.name] ?? 0}
        </span>
      ),
      align: "right",
    },
    {
      key: "status",
      header: "Status",
      render: (category) => {
        const status = getCategoryStatus(category);

        return (
          <Badge
            tone={status === "active" ? "success" : status === "pushed" ? "warning" : "danger"}
          >
            {statusLabels[status]}
          </Badge>
        );
      },
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
                  setSelectedCategory(category);
                  setIsModalOpen(true);
                  setOpenActionMenuId(undefined);
                }}
                type="button"
              >
                <Pencil aria-hidden="true" className="size-4" />
                Edit Category
              </button>
              <button
                className="flex min-h-10 w-full items-center gap-3 px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                onClick={() => {
                  setDeleteCategory(category);
                  setOpenActionMenuId(undefined);
                }}
                type="button"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Delete Category
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
          eyebrow="Categories"
          title="Category setup"
          description="Create category names once, then use them in budget and expense forms."
        />
        <Button
          className="w-full shadow-sm transition-shadow hover:shadow-md sm:w-auto"
          icon={<Plus aria-hidden="true" className="size-4" />}
          onClick={() => {
            setSelectedCategory(undefined);
            setIsModalOpen(true);
          }}
          type="button"
        >
          Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        emptyMessage="No categories saved yet."
        getRowKey={(category) => category.id}
        rows={categories}
      />
      <CategoryModal
        category={selectedCategory}
        key={selectedCategory?.id ?? "new-category"}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setSelectedCategory(undefined);
          }
        }}
        open={isModalOpen}
      />
      <ConfirmationModal
        actionLabel="Delete"
        cancelLabel="Cancel"
        description={
          deleteCategory
            ? `This will remove "${deleteCategory.name}" from category setup. Existing expense records keep their saved category text.`
            : "This will remove the selected category."
        }
        onConfirm={async () => {
          if (!deleteCategory) {
            return;
          }

          if (!(await deleteBudgetCategory(deleteCategory.id))) return false;
          setDeleteCategory(undefined);
        }}
        onOpenChange={(open) => !open && setDeleteCategory(undefined)}
        open={Boolean(deleteCategory)}
        title="Delete Category"
        variant="danger"
      />
    </div>
  );
}
