import { NoteCollectionPage } from "@/components/life/note-collection-page";

export default function HealthPage() {
  return (
    <NoteCollectionPage
      eyebrow="Health"
      title="Health and medicine"
      description="Track medicine, water, exercise, sleep, and health reminders."
      addLabel="Add record"
      emptyLabel="Add your first health or medicine record."
      tag="health"
    />
  );
}
