import { NoteCollectionPage } from "@/components/life/note-collection-page";

export default function ReminderPage() {
  return (
    <NoteCollectionPage
      eyebrow="Reminder"
      title="Bills, medicine, and routine reminders"
      description="Keep upcoming, missed, and daily reminders visible."
      addLabel="Add reminder"
      emptyLabel="Add your first bill, medicine, or personal reminder."
      tag="reminder"
    />
  );
}
