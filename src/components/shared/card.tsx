import { MoreVertical, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SharedCardProps = {
  className?: string;
  children: ReactNode;
};

type SharedCardHeaderProps = {
  title: string;
  action?: ReactNode;
};

type SharedCardButtonProps = {
  children: ReactNode;
};

type StatCardTone = "emerald" | "red" | "blue";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  progress: number;
  icon: LucideIcon;
  tone: StatCardTone;
};

const statToneStyles: Record<StatCardTone, { icon: string; value: string; bar: string }> = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-500",
    value: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  red: {
    icon: "bg-red-50 text-red-500",
    value: "text-red-500",
    bar: "bg-red-500",
  },
  blue: {
    icon: "bg-blue-50 text-blue-500",
    value: "text-blue-500",
    bar: "bg-blue-500",
  },
};

export function SharedCard({ className, children }: SharedCardProps) {
  return (
    <section
      className={cn(
        "min-w-0 border border-slate-200 bg-white p-6 shadow-[0_10px_34px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SharedCardHeader({ title, action }: SharedCardHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="truncate text-base font-semibold text-slate-950">{title}</h2>
      {action}
    </div>
  );
}

export function SharedCardButton({ children }: SharedCardButtonProps) {
  return (
    <button
      className="inline-flex min-h-10 items-center gap-2 border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-500/40 hover:text-emerald-600"
      type="button"
    >
      {children}
    </button>
  );
}

export function StatCard({ label, value, detail, progress, icon: Icon, tone }: StatCardProps) {
  const colors = statToneStyles[tone];

  return (
    <SharedCard className="relative p-5">
      <MoreVertical
        aria-hidden="true"
        className="absolute right-4 top-5 size-4 text-slate-500"
        strokeWidth={1.9}
      />
      <div className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)] items-center gap-3 pr-5">
        <span className={cn("flex size-11 items-center justify-center rounded-full", colors.icon)}>
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-700">{label}</p>
          <p
            className={cn(
              "mt-2 truncate font-mono text-[clamp(1.35rem,1.75vw,2rem)] font-semibold leading-tight",
              colors.value,
            )}
            title={value}
          >
            {value}
          </p>
          <p className="mt-2 truncate text-sm font-medium text-slate-500">{detail}</p>
        </div>
      </div>
      <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div className={cn("h-full rounded-full", colors.bar)} style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </SharedCard>
  );
}
