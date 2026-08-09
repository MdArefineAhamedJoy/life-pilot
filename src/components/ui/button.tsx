import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  icon?: ReactNode;
};

const variants = {
  primary: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
  secondary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
  ghost: "text-slate-800 hover:bg-slate-100",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  outline: "border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50",
};

export function Button({ className, variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-9 max-w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-center text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
