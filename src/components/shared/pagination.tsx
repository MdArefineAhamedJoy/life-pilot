"use client";

import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
  boundaryCount?: number;
};

function range(start: number, end: number) {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);
  const startPages = range(1, Math.min(boundaryCount, safeTotalPages));
  const endPages = range(
    Math.max(safeTotalPages - boundaryCount + 1, boundaryCount + 1),
    safeTotalPages,
  );
  const leftSibling = Math.max(safePage - siblingCount, boundaryCount + 1);
  const rightSibling = Math.min(safePage + siblingCount, safeTotalPages - boundaryCount);
  const shouldShowLeftEllipsis = leftSibling > boundaryCount + 1;
  const shouldShowRightEllipsis = rightSibling < safeTotalPages - boundaryCount;
  const middlePages = range(leftSibling, rightSibling);
  const pages: Array<number | "ellipsis-left" | "ellipsis-right"> = [
    ...startPages,
    ...(shouldShowLeftEllipsis ? (["ellipsis-left"] as const) : []),
    ...middlePages,
    ...(shouldShowRightEllipsis ? (["ellipsis-right"] as const) : []),
    ...endPages,
  ];

  function goTo(nextPage: number) {
    if (nextPage < 1 || nextPage > safeTotalPages || nextPage === safePage) {
      return;
    }

    onPageChange(nextPage);
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3", className)}
      role="navigation"
    >
      <p className="whitespace-nowrap text-sm font-medium text-slate-600">
        Page <span className="text-slate-900">{safePage}</span> of{" "}
        <span className="text-slate-900">{safeTotalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          aria-label="Go to previous page"
          className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-45"
          disabled={safePage <= 1}
          onClick={() => goTo(safePage - 1)}
          type="button"
        >
          Previous
        </button>
        <ul className="hidden items-center gap-1 sm:flex" aria-label="Pages">
          {pages.map((item, index) => {
            if (item === "ellipsis-left" || item === "ellipsis-right") {
              return (
                <li className="select-none px-2 text-sm text-slate-400" key={`${item}-${index}`}>
                  ...
                </li>
              );
            }

            const isActive = item === safePage;

            return (
              <li key={item}>
                <button
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`Go to page ${item}`}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-md border text-sm font-medium shadow-sm transition",
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                  onClick={() => goTo(item)}
                  type="button"
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          aria-label="Go to next page"
          className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-45"
          disabled={safePage >= safeTotalPages}
          onClick={() => goTo(safePage + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
