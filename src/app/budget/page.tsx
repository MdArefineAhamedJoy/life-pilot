"use client";

import { BudgetWorkspace } from "@/components/budget/budget-workspace";
import { useLifeOs } from "@/components/state/life-os-provider";
import { SectionHeader } from "@/components/ui/section-header";

export default function BudgetPage() {
  const { categories, expenses } = useLifeOs();

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Budget"
        title="Budget and daily cost"
        description="Manage category limits, track bajar cost, and review total spending."
      />
      <BudgetWorkspace categories={categories} expenses={expenses} />
    </div>
  );
}
