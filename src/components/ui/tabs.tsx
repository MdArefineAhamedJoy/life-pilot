"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabItem<T extends string> = {
  id: T;
  label: string;
  icon?: LucideIcon;
};

type TabsProps<T extends string> = {
  ariaLabel: string;
  fullWidth?: boolean;
  onValueChange: (value: T) => void;
  tabs: TabItem<T>[];
  value: T;
};

export function Tabs<T extends string>({ ariaLabel, fullWidth = false, onValueChange, tabs, value }: TabsProps<T>) {
  return (
    <div className={cn(fullWidth ? "border border-b-0 border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]" : "border-b border-slate-200")}>
      <div className={cn(fullWidth ? "grid" : "inline-flex max-w-full overflow-x-auto")} style={fullWidth ? { gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` } : undefined}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              aria-label={tab.label}
              aria-pressed={value === tab.id}
              className={cn(
                fullWidth
                  ? "min-h-14 min-w-0 truncate px-2 text-xs font-semibold transition sm:px-4 sm:text-sm"
                  : "flex min-h-14 shrink-0 items-center justify-center gap-2 border border-b-0 border-slate-200 px-6 text-sm font-semibold transition first:rounded-tl-xl last:rounded-tr-xl",
                value === tab.id
                  ? fullWidth ? "bg-emerald-500 text-white" : "border-emerald-500 bg-emerald-500 text-white shadow-[0_-4px_16px_rgba(16,185,129,0.16)]"
                  : fullWidth ? "text-slate-600 hover:bg-slate-50 hover:text-slate-950" : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              )}
              key={tab.id}
              onClick={() => onValueChange(tab.id)}
              type="button"
            >
              {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
