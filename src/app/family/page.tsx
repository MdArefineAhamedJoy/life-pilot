import { FeaturePage } from "@/components/life/feature-page";

export default function FamilyPage() {
  return (
    <FeaturePage
      eyebrow="Family"
      title="Family and baby cost"
      description="Track baby, parents, family, and recurring monthly household needs."
      primaryAction="Add Family Cost"
      metrics={[
        { label: "Baby", value: "BDT 520", detail: "Today tracked", tone: "primary" },
        { label: "Family", value: "BDT 8,000", detail: "Monthly plan", tone: "secondary" },
      ]}
      panels={[
        { title: "Cost Groups", eyebrow: "Family", items: ["Baby", "Parents", "Family", "Monthly Cost"], tone: "primary" },
        { title: "Recurring Needs", eyebrow: "Plan", items: ["Baby wipes", "Medicine", "School fee", "Family groceries"], tone: "secondary" },
      ]}
    />
  );
}
