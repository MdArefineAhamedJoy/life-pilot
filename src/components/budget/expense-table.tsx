"use client";
import { useFormatCurrency } from "@/hooks/use-format-currency";
import type { Expense } from "@/lib/types";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";

import { DataTable, type TableColumn } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";

type ExpenseTableProps = {
  expenses: Expense[];
};

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const formatCurrency = useFormatCurrency();
  const { deleteExpense } = useLifeOs();
  const columns: TableColumn<Expense>[] = [
    { key: "date", header: "Date", render: (expense) => expense.date },
    { key: "item", header: "Item", render: (expense) => expense.itemName },
    { key: "category", header: "Category", render: (expense) => <Badge>{expense.category}</Badge> },
    { key: "source", header: "Source", render: (expense) => expense.sourceType },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (expense) => <span className="font-mono">{formatCurrency(expense.amount)}</span>,
    },
    { key: "actions", header: "Actions", render: (expense) => <Button variant="ghost" type="button" aria-label={`Delete ${expense.itemName}`} onClick={async () => {
      if (window.confirm(`Delete ${expense.itemName}?`)) await deleteExpense(expense.id);
    }}>Delete</Button> },
  ];

  return <DataTable columns={columns} emptyMessage="No expense saved yet." getRowKey={(expense) => expense.id} rows={expenses} />;
}
