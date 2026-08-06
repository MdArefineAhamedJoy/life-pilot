import { FeaturePage } from "@/components/life/feature-page";

export default function CalendarPage() {
  return (
    <FeaturePage
      eyebrow="Calendar"
      title="Expenses, tasks, and reminders by date"
      description="A future calendar view for daily, weekly, and monthly life planning."
      primaryAction="Add Event"
      metrics={[
        { label: "Today", value: "6", detail: "Items on calendar", tone: "primary" },
        { label: "Week", value: "18", detail: "Planned items", tone: "secondary" },
      ]}
      panels={[
        { title: "Calendar Views", eyebrow: "Navigation", items: ["Month View", "Week View", "Day View"], tone: "secondary" },
        { title: "Event Types", eyebrow: "Shown", items: ["Expense", "Task", "Reminder"], tone: "primary" },
      ]}
    />
  );
}
