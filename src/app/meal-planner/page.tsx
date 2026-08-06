import { FeaturePage } from "@/components/life/feature-page";

export default function MealPlannerPage() {
  return (
    <FeaturePage
      eyebrow="Meal Planner"
      title="Daily and weekly meals"
      description="Plan breakfast, lunch, dinner, and snacks with future shopping-list support."
      primaryAction="Add Meal"
      metrics={[
        { label: "Today", value: "4", detail: "Meals planned", tone: "primary" },
        { label: "Week", value: "18", detail: "Meals drafted", tone: "secondary" },
      ]}
      panels={[
        { title: "Today", eyebrow: "Meals", items: ["Breakfast", "Lunch", "Dinner", "Snacks"], tone: "primary" },
        { title: "Weekly Meal Calendar", eyebrow: "Plan", items: ["Sunday family lunch", "Tuesday simple dinner", "Friday grocery prep"], tone: "secondary" },
      ]}
    />
  );
}
