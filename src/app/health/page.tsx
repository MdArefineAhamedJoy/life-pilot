import { FeaturePage } from "@/components/life/feature-page";

export default function HealthPage() {
  return (
    <FeaturePage
      eyebrow="Health"
      title="Health and medicine"
      description="Track medicine, water, exercise, sleep, and health reminders."
      primaryAction="Add Record"
      metrics={[
        { label: "Water", value: "6/8", detail: "Glasses today", tone: "secondary" },
        { label: "Sleep", value: "7h", detail: "Last night", tone: "success" },
        { label: "Medicine", value: "1", detail: "Reminder pending", tone: "warning" },
      ]}
      panels={[
        { title: "Daily Health", eyebrow: "Today", items: ["Water Intake", "Sleep", "Exercise", "Medicine"], progress: 75, tone: "success" },
        { title: "Reminders", eyebrow: "Upcoming", items: ["Medicine at 9 PM", "Weight check Friday", "Walk after dinner"], tone: "warning" },
      ]}
    />
  );
}
