import { NoteCollectionPage } from "@/components/life/note-collection-page";

export default function ShoppingPage() {
  return (
    <NoteCollectionPage
      eyebrow="Shopping"
      title="Shopping list"
      description="Keep market items organized and convert purchased items into expenses later."
      addLabel="Add item"
      emptyLabel="Add your first shopping item or list."
      tag="shopping"
    />
  );
}
