import { FeaturePage } from "@/components/life/feature-page";

export default function GoalsPage() {
  return (
    <FeaturePage
      eyebrow="Goals"
      title="Savings and life goals"
      description="Track emergency fund, large purchases, travel, and long-term family goals."
      primaryAction="New Goal"
      metrics={[
        { label: "Emergency Fund", value: "65%", detail: "BDT 65,000 saved", tone: "success" },
        { label: "Laptop", value: "40%", detail: "BDT 32,000 saved", tone: "secondary" },
        { label: "Vacation", value: "22%", detail: "Monthly saving plan", tone: "primary" },
      ]}
      panels={[
        { title: "Goal Progress", eyebrow: "Savings", items: ["Emergency Fund", "Buy Laptop", "Vacation", "Bike", "House"], progress: 65, tone: "success" },
        { title: "Next Contributions", eyebrow: "Plan", items: ["BDT 5,000 to emergency", "BDT 3,000 to laptop", "BDT 1,500 to vacation"], tone: "secondary" },
      ]}
    />
  );
}
