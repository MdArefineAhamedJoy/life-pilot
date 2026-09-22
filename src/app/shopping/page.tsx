"use client";

import { AddShoppingItemDialog } from "@/components/shopping/add-shopping-item-dialog";
import { StatCard } from "@/components/shared/card";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { DataTable, type TableColumn } from "@/components/shared/data-table";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectInput, TextInput } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/section-header";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import type { BudgetCategory } from "@/lib/types";
import { categoriesService } from "@/services/categories.service";
import { shoppingService } from "@/services/shopping.service";
import type { ShoppingItem, ShoppingItemStatus, ShoppingSummary } from "@/types/shopping.types";
import { CheckCircle2, ListChecks, MoreVertical, ShoppingCart, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type PaginationMeta = { page: number; totalPages: number };

export default function ShoppingPage() {
  const formatCurrency = useFormatCurrency();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ShoppingItemStatus | undefined>();
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [summary, setSummary] = useState<ShoppingSummary | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, totalPages: 1 });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<ShoppingItem | undefined>();
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
    async function loadItems() {
      setIsLoading(true);
      setError("");
      const filters = { search: search || undefined, status, category: category || undefined };
      try {
        const [itemsResponse, summaryResponse] = await Promise.all([
          shoppingService.list({ page, limit: pageSize, ...filters }),
          shoppingService.getSummary(filters),
        ]);
        setItems(itemsResponse.data);
        setMeta(itemsResponse.meta ?? { page, totalPages: 1 });
        setSummary(summaryResponse.data);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Failed to load shopping items.");
      } finally {
        setIsLoading(false);
      }
    }
    void loadItems();
  }, [category, page, reloadVersion, search, status]);

  async function handleMarkPurchased(item: ShoppingItem) {
    try {
      await shoppingService.markPurchased(item.id);
      setReloadVersion((current) => current + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to mark item as purchased.");
    }
  }

  async function handleDelete() {
    if (!deleteItem) return false;
    try {
      await shoppingService.remove(deleteItem.id);
      setReloadVersion((current) => current + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to delete shopping item.");
      return false;
    }
  }

  if (isLoading || isCategoriesLoading)
    return <PageSkeleton filterCount={3} tableColumnCount={7} />;

  const hasActiveFilters = Boolean(search || status || category);
  const columns: TableColumn<ShoppingItem>[] = [
    {
      key: "item",
      header: "Item",
      render: (item) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{item.name}</p>
          {item.note && (
            <p className="mt-1 max-w-[240px] truncate text-xs text-slate-500">{item.note}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (item.category ? <Badge>{item.category}</Badge> : "-"),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item) =>
        item.quantity ? `${item.quantity}${item.unit ? ` ${item.unit}` : ""}` : item.unit || "-",
    },
    {
      key: "price",
      header: "Estimated cost",
      align: "right",
      render: (item) => (
        <span className="font-mono font-medium">{formatCurrency(item.estimatedPrice ?? 0)}</span>
      ),
    },
    {
      key: "added",
      header: "Added",
      render: (item) => (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge tone={item.status === "purchased" ? "success" : "amber"}>
          {item.status === "purchased" ? "Purchased" : "To buy"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (item) => (
        <div className="relative flex justify-end">
          <button
            aria-expanded={openActionMenuId === item.id}
            aria-label={`Open actions for ${item.name}`}
            className="flex size-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            onClick={() =>
              setOpenActionMenuId((current) => (current === item.id ? undefined : item.id))
            }
            type="button"
          >
            <MoreVertical aria-hidden="true" className="size-4" />
          </button>
          {openActionMenuId === item.id && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-48 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
              {item.status === "pending" && (
                <button
                  className="flex min-h-10 w-full items-center gap-3 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
                  onClick={() => {
                    void handleMarkPurchased(item);
                    setOpenActionMenuId(undefined);
                  }}
                  type="button"
                >
                  <CheckCircle2 aria-hidden="true" className="size-4" />
                  Mark purchased
                </button>
              )}
              <button
                className="flex min-h-10 w-full items-center gap-3 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-red-600"
                onClick={() => {
                  setDeleteItem(item);
                  setOpenActionMenuId(undefined);
                }}
                type="button"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Delete item
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
          eyebrow="Shopping"
          title="Shopping list"
          description="Plan market items, track their estimated cost, and mark them purchased."
        />
        <AddShoppingItemDialog onSaved={() => setReloadVersion((current) => current + 1)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail="Items in this view"
          icon={ListChecks}
          label="Shopping items"
          progress={summary?.totalItems ? 100 : 0}
          tone="blue"
          value={String(summary?.totalItems ?? 0)}
        />
        <StatCard
          detail="Still on your list"
          icon={ShoppingCart}
          label="To buy"
          progress={
            summary?.totalItems
              ? Math.round(((summary.pendingItems ?? 0) / summary.totalItems) * 100)
              : 0
          }
          tone="amber"
          value={String(summary?.pendingItems ?? 0)}
        />
        <StatCard
          detail="Completed purchases"
          icon={CheckCircle2}
          label="Purchased"
          progress={
            summary?.totalItems
              ? Math.round(((summary.purchasedItems ?? 0) / summary.totalItems) * 100)
              : 0
          }
          tone="emerald"
          value={String(summary?.purchasedItems ?? 0)}
        />
        <StatCard
          detail="Total estimated cost"
          icon={ShoppingCart}
          label="Expected spend"
          progress={summary?.totalItems ? 100 : 0}
          tone="red"
          value={formatCurrency(summary?.estimatedTotal ?? 0)}
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
          aria-label="Search shopping items"
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Rice, milk, detergent"
          value={search}
        />
        <SelectInput
          aria-label="Filter by status"
          onChange={(event) => {
            setStatus((event.target.value || undefined) as ShoppingItemStatus | undefined);
            setPage(1);
          }}
          value={status ?? ""}
        >
          <option value="">All statuses</option>
          <option value="pending">To buy</option>
          <option value="purchased">Purchased</option>
        </SelectInput>
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
      </div>
      {hasActiveFilters && (
        <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span>Filters are applied on the server.</span>
          <Button
            icon={<X aria-hidden="true" className="size-3.5" />}
            onClick={() => {
              setSearch("");
              setStatus(undefined);
              setCategory("");
              setPage(1);
            }}
            type="button"
            variant="ghost"
          >
            Clear
          </Button>
        </div>
      )}
      <DataTable
        columns={columns}
        emptyMessage="No shopping items yet. Add the first item to your list."
        getRowKey={(item) => item.id}
        paginated={false}
        rows={items}
        serverPagination={{ page: meta.page, totalPages: meta.totalPages, onPageChange: setPage }}
      />
      <ConfirmationModal
        actionLabel="Delete item"
        cancelLabel="Cancel"
        description={
          deleteItem
            ? `This permanently deletes "${deleteItem.name}" from your shopping list.`
            : "This permanently deletes the selected shopping item."
        }
        onConfirm={handleDelete}
        onOpenChange={(open) => !open && setDeleteItem(undefined)}
        open={Boolean(deleteItem)}
        title="Delete shopping item"
        variant="danger"
      />
    </div>
  );
}
