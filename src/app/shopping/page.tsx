import { FeaturePage } from "@/components/life/feature-page";

export default function ShoppingPage() {
  return (
    <FeaturePage
      eyebrow="Shopping"
      title="Shopping list"
      description="Keep market items organized and convert purchased items into expenses later."
      primaryAction="Add Item"
      secondaryAction="Convert To Expense"
      metrics={[
        { label: "Pending", value: "8", detail: "Items left to buy", tone: "warning" },
        { label: "Completed", value: "5", detail: "Purchased today", tone: "success" },
      ]}
      panels={[
        { title: "Pending Items", eyebrow: "Bajar", items: ["Milk", "Rice", "Egg", "Chicken", "Vegetables"], tone: "warning" },
        { title: "Completed", eyebrow: "Today", items: ["Soap", "Baby wipes", "Mobile data"], tone: "success" },
      ]}
    />
  );
}
