import { NoteCollectionPage } from "@/components/life/note-collection-page";

export default function MealPlannerPage() {
  return (
    <NoteCollectionPage
      eyebrow="Meal Planner"
      title="Daily and weekly meals"
      description="Plan breakfast, lunch, dinner, and snacks with future shopping-list support."
      addLabel="Add meal"
      emptyLabel="Add your first meal plan."
      tag="meal"
    />
  );
}
