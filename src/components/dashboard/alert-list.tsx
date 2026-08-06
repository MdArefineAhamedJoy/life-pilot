import type { AlertItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const toneMap = {
  info: "indigo",
  warning: "warning",
  danger: "danger",
  success: "success",
} as const;

type AlertListProps = {
  alerts: AlertItem[];
};

export function AlertList({ alerts }: AlertListProps) {
  return (
    <Card title="Alerts And Reminders" eyebrow="Today">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-start sm:justify-between" key={alert.id}>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
              <p className="mt-1 text-sm text-slate-600">{alert.detail}</p>
            </div>
            <Badge tone={toneMap[alert.tone]}>{alert.tone}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
