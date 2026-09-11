import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-16 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-base text-slate-900 shadow-sm outline-none transition-[color,box-shadow] placeholder:text-slate-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-emerald-600 focus-visible:ring-[3px] focus-visible:ring-emerald-600/25",
        "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-red-500/20",
        className
      )}
      data-slot="textarea"
      {...props}
    />
  );
}
