import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

const variants = {
  primary: "bg-emerald-500 text-white hover:bg-emerald-600",
  secondary: "bg-blue-500 text-white hover:bg-blue-600",
  ghost: "text-slate-800 hover:bg-slate-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export function Button({ className, variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-center text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
