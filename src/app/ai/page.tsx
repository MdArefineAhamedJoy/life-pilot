import { FeaturePage } from "@/components/life/feature-page";

export default function AiPage() {
  return (
    <FeaturePage
      eyebrow="AI Assistant"
      title="Optional AI helper"
      description="AI remains disabled by default, with future support for expense analysis, OCR, and routine suggestions."
      primaryAction="Configure AI"
      metrics={[
        { label: "Mode", value: "Off", detail: "No paid dependency", tone: "neutral" },
        { label: "Privacy", value: "Local", detail: "Data stays in browser for MVP", tone: "success" },
      ]}
      panels={[
        { title: "Suggested Actions", eyebrow: "Future", items: ["Expense Summary", "Routine Suggestion", "Receipt Parser", "Generate Report"], tone: "secondary" },
        { title: "AI Inputs", eyebrow: "Ask", items: ["Ask AI", "Expense Analysis", "Monthly Summary", "OCR Review"], tone: "primary" },
      ]}
    />
  );
}
