import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TableColumn<Row> = {
  key: string;
  header: string;
  render: (row: Row) => ReactNode;
  align?: "left" | "right";
};

type DataTableProps<Row> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  emptyMessage?: string;
};

export function DataTable<Row>({ columns, rows, getRowKey, emptyMessage = "No data yet." }: DataTableProps<Row>) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-[680px] divide-y divide-slate-200 text-sm md:min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  className={cn(
                    "whitespace-nowrap px-3 py-3 font-semibold text-slate-600 sm:px-4",
                    column.align === "right" ? "text-right" : "text-left",
                  )}
                  key={column.key}
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr className="hover:bg-slate-50" key={getRowKey(row)}>
                  {columns.map((column) => (
                    <td
                      className={cn(
                        "whitespace-nowrap px-3 py-3 text-slate-700 sm:px-4",
                        column.align === "right" ? "text-right" : "text-left",
                      )}
                      key={column.key}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
