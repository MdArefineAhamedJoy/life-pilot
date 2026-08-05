import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  progress?: number;
  tone?: "teal" | "amber" | "rose" | "indigo" | "zinc";
};

export function MetricCard({ label, value, detail, progress, tone = "teal" }: MetricCardProps) {
  return (
    <Card className="min-h-32 sm:min-h-36">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-3 break-words text-2xl font-semibold text-zinc-950 sm:text-3xl">{value}</p>
      <p className="mt-2 text-sm text-zinc-600">{detail}</p>
      {typeof progress === "number" && <div className="mt-4"><ProgressBar value={progress} tone={tone} /></div>}
    </Card>
  );
}
