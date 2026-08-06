import { FeaturePage } from "@/components/life/feature-page";

export default function ReminderPage() {
  return (
    <FeaturePage
      eyebrow="Reminder"
      title="Bills, medicine, and routine reminders"
      description="Keep upcoming, missed, and daily reminders visible."
      primaryAction="Add Reminder"
      metrics={[
        { label: "Upcoming", value: "4", detail: "Due today", tone: "warning" },
        { label: "Missed", value: "1", detail: "Needs reschedule", tone: "danger" },
      ]}
      panels={[
        { title: "Today's Reminder", eyebrow: "Now", items: ["Bills", "Meeting", "Medicine", "Routine", "Birthday"], tone: "warning" },
        { title: "Missed Reminder", eyebrow: "Attention", items: ["Internet bill follow-up"], tone: "danger" },
      ]}
    />
  );
}
