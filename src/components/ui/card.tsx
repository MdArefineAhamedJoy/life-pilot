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
      className={cn("min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-5", className)}
      {...props}
    >
      {(title || eyebrow || action) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="text-xs font-semibold uppercase tracking-normal text-zinc-500">{eyebrow}</p>}
            {title && <h2 className="mt-1 break-words text-base font-semibold text-zinc-950 sm:text-lg">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
