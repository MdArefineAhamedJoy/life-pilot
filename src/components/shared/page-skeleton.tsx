import { Skeleton } from "@/components/shared/skeleton";

type PageSkeletonProps = {
  cardCount?: number;
  filterCount?: number;
  tableColumnCount?: number;
  tableRowCount?: number;
};

export function PageSkeleton({
  cardCount = 3,
  filterCount = 3,
  tableColumnCount = 5,
  tableRowCount = 4,
}: PageSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Loading page" className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cardCount }, (_, index) => (
          <div className="space-y-4 rounded-md border border-slate-200 bg-white p-6" key={index}>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: filterCount }, (_, index) => (
          <Skeleton className="h-9 w-full" key={index} />
        ))}
      </div>
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div
          className="grid gap-4 border-b border-slate-200 bg-slate-50 p-4"
          style={{ gridTemplateColumns: `repeat(${tableColumnCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: tableColumnCount }, (_, index) => (
            <Skeleton className="h-4 w-full" key={index} />
          ))}
        </div>
        <div className="space-y-5 p-4">
          {Array.from({ length: tableRowCount }, (_, index) => (
            <Skeleton className="h-8 w-full" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
