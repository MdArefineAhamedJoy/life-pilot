"use client";

import { ReportsDashboard } from "@/components/life/reports-dashboard";
import { SectionHeader } from "@/components/ui/section-header";

export default function ReportsPage() {
  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Reports"
        title="Spending and routine reports"
        description="Review budget use, routine completion, focus time, and remaining monthly money."
      />
      <ReportsDashboard />
    </div>
  );
}
