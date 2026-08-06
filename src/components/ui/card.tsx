import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function Card({ className, title, eyebrow, action, children, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
        className,
      )}
      {...props}
    >
      {(title || eyebrow || action) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-normal text-emerald-600">{eyebrow}</p>}
            {title && <h2 className="mt-1 break-words text-base font-semibold text-slate-800 sm:text-lg">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
