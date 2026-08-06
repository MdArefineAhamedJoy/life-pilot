"use client";

import { BudgetCategoryList } from "@/components/budget/budget-category-list";
import { CategoryManager } from "@/components/budget/category-manager";
import { useLifeOs } from "@/components/state/life-os-provider";
import { SectionHeader } from "@/components/ui/section-header";

export default function CategoriesPage() {
  const { categories, expenses } = useLifeOs();

  return (
    <div className="min-w-0 space-y-6">
      <SectionHeader
        eyebrow="Categories"
        title="Budget categories"
        description="Food, baby, medicine, transport, bills, savings, and emergency buckets."
      />
      <CategoryManager />
      <BudgetCategoryList categories={categories} expenses={expenses} />
    </div>
  );
}
