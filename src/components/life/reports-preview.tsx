import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

const reports = [
  { label: "Budget accuracy", value: 68, tone: "teal" as const },
  { label: "Routine completion", value: 25, tone: "indigo" as const },
  { label: "Focus consistency", value: 54, tone: "amber" as const },
];

export function ReportsPreview() {
  return (
    <Card title="Reports Preview" eyebrow="Reports" id="reports">
      <div className="space-y-4">
        {reports.map((report) => (
          <ProgressBar key={report.label} label={`${report.label}: ${report.value}%`} tone={report.tone} value={report.value} />
        ))}
      </div>
    </Card>
  );
}
