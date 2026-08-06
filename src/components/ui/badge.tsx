import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "teal" | "amber" | "rose" | "indigo" | "success" | "warning" | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-800",
  teal: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-red-50 text-red-500",
  indigo: "bg-blue-50 text-blue-500",
  success: "bg-green-50 text-green-500",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-500",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex max-w-full items-center rounded px-2 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
