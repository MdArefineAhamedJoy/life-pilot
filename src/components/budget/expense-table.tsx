import type { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTable, type TableColumn } from "@/components/ui/data-table";

type ExpenseTableProps = {
  expenses: Expense[];
};

export function ExpenseTable({ expenses }: ExpenseTableProps) {
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
  ];

  return <DataTable columns={columns} emptyMessage="No expense saved yet." getRowKey={(expense) => expense.id} rows={expenses} />;
}
