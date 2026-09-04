import { NoteCollectionPage } from "@/components/life/note-collection-page";

export default function GoalsPage() {
  return (
    <NoteCollectionPage
      eyebrow="Goals"
      title="Savings and life goals"
      description="Track emergency fund, large purchases, travel, and long-term family goals."
      addLabel="New goal"
      emptyLabel="Create your first savings or life goal."
      tag="goal"
    />
  );
}
