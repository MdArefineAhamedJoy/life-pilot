import { NoteCollectionPage } from "@/components/life/note-collection-page";

export default function FamilyPage() {
  return (
    <NoteCollectionPage
      eyebrow="Family"
      title="Family and baby cost"
      description="Track baby, parents, family, and recurring monthly household needs."
      addLabel="Add family item"
      emptyLabel="Add a family cost, care item, or recurring need."
      tag="family"
    />
  );
}
