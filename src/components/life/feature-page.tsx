import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

type Tone = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";

type Metric = {
  label: string;
  value: string;
  detail: string;
  tone?: Tone;
};

type Panel = {
  title: string;
  eyebrow?: string;
  items: string[];
  tone?: Tone;
  progress?: number;
};

type BoardColumn = {
  title: string;
  items: string[];
};

type FeaturePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: string;
  secondaryAction?: string;
  metrics?: Metric[];
  panels: Panel[];
  board?: BoardColumn[];
};

const toneStyles: Record<Tone, string> = {
  primary: "border-emerald-500/20 bg-emerald-50 text-emerald-600",
  secondary: "border-blue-500/20 bg-blue-50 text-blue-500",
  success: "border-green-500/20 bg-green-50 text-green-500",
  warning: "border-amber-500/20 bg-amber-50 text-amber-600",
  danger: "border-red-500/20 bg-red-50 text-red-500",
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
};

const progressTone: Record<Tone, "teal" | "amber" | "rose" | "indigo" | "zinc"> = {
  primary: "teal",
  secondary: "indigo",
  success: "teal",
  warning: "amber",
  danger: "rose",
  neutral: "zinc",
};

export function FeaturePage({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  metrics = [],
  panels,
  board,
}: FeaturePageProps) {
  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        {(primaryAction || secondaryAction) && (
          <div className="grid gap-2 sm:flex sm:justify-start lg:justify-end">
            {secondaryAction && (
              <Button type="button" variant="secondary">
                {secondaryAction}
              </Button>
            )}
            {primaryAction && <Button type="button">{primaryAction}</Button>}
          </div>
        )}
      </div>

      {metrics.length > 0 && (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <div
                className={cn(
                  "mb-4 inline-flex rounded-xl border px-2.5 py-1 text-xs font-semibold",
                  toneStyles[metric.tone ?? "neutral"],
                )}
              >
                {metric.label}
              </div>
              <p className="break-words font-mono text-2xl font-semibold text-slate-800 sm:text-3xl">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-slate-600">{metric.detail}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        {panels.map((panel) => (
          <Card eyebrow={panel.eyebrow} key={panel.title} title={panel.title}>
            <div className="space-y-3">
              {typeof panel.progress === "number" && (
                <ProgressBar tone={progressTone[panel.tone ?? "primary"]} value={panel.progress} />
              )}
              {panel.items.map((item) => (
                <div
                  className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                  key={item}
                >
                  <span className="min-w-0 truncate text-sm font-medium text-slate-800">{item}</span>
                  <Badge tone={panel.tone === "danger" ? "danger" : panel.tone === "warning" ? "warning" : "teal"}>
                    Ready
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {board && (
        <Card eyebrow="Workflow" title="Board View">
          <div className="grid min-w-0 gap-4 md:grid-cols-3">
            {board.map((column) => (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3" key={column.title}>
                <h3 className="text-sm font-semibold text-slate-800">{column.title}</h3>
                <div className="mt-3 space-y-2">
                  {column.items.map((item) => (
                    <div className="rounded-xl bg-white p-3 text-sm text-slate-700 shadow-sm" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
