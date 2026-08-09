import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FieldShellProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function FieldShell({ label, hint, children }: FieldShellProps) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="flex items-center gap-2 text-sm font-medium leading-none text-slate-900">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-slate-200 bg-transparent px-3 py-1 text-base text-slate-900 shadow-sm outline-none transition-[color,box-shadow] placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-[3px] focus-visible:ring-emerald-600/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function SelectInput({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-9 w-full min-w-0 items-center justify-between rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-[color,box-shadow] focus-visible:border-emerald-600 focus-visible:ring-[3px] focus-visible:ring-emerald-600/25 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-16 w-full min-w-0 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-base text-slate-900 shadow-sm outline-none transition-[color,box-shadow] placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-[3px] focus-visible:ring-emerald-600/25 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
