"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/shared/pagination";

export type TableColumn<Row> = {
  key: string;
  header: string;
  render: (row: Row) => ReactNode;
  align?: "left" | "right";
  width?: string;
};

type DataTableProps<Row> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  emptyMessage?: string;
  pageSize?: number;
  paginated?: boolean;
  minHeightClassName?: string;
  className?: string;
};

export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "No data yet.",
  pageSize = 10,
  paginated = true,
  minHeightClassName = "min-h-[600px]",
  className,
}: DataTableProps<Row>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleRows = useMemo(() => {
    if (!paginated) {
      return rows;
    }

    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [currentPage, pageSize, paginated, rows]);

  function handlePageChange(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  return (
    <div className={cn("flex min-w-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white", minHeightClassName, className)}>
      <div className="min-h-0 flex-1 overflow-x-auto">
        <table className="min-w-[900px] divide-y divide-slate-200 text-sm md:min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  className={cn(
                    "h-12 whitespace-nowrap px-4 text-sm font-semibold text-slate-600",
                    column.align === "right" ? "text-right" : "text-left",
                  )}
                  key={column.key}
                  scope="col"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => (
                <tr className="transition-colors hover:bg-slate-50" key={getRowKey(row)}>
                  {columns.map((column) => (
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-4 text-slate-700",
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
                <td className="px-4 py-16 text-center text-slate-500" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination onPageChange={handlePageChange} page={currentPage} totalPages={paginated ? totalPages : 1} />
    </div>
  );
}
