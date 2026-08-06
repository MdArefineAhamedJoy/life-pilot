import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  tone?: "teal" | "amber" | "rose" | "indigo" | "zinc";
  label?: string;
};

const tones = {
  teal: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-red-500",
  indigo: "bg-blue-500",
  zinc: "bg-slate-800",
};

export function ProgressBar({ value, tone = "teal", label }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(value, 100));

  return (
    <div className="space-y-2">
      {label && <div className="text-xs font-medium text-slate-500">{label}</div>}
      <div className="h-2 overflow-hidden rounded bg-slate-200">
        <div className={cn("h-full rounded", tones[tone])} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
