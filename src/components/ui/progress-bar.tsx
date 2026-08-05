import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  tone?: "teal" | "amber" | "rose" | "indigo" | "zinc";
  label?: string;
};

const tones = {
  teal: "bg-teal-600",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  indigo: "bg-indigo-600",
  zinc: "bg-zinc-900",
};

export function ProgressBar({ value, tone = "teal", label }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(value, 100));

  return (
    <div className="space-y-2">
      {label && <div className="text-xs font-medium text-zinc-500">{label}</div>}
      <div className="h-2 overflow-hidden rounded bg-zinc-100">
        <div className={cn("h-full rounded", tones[tone])} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
