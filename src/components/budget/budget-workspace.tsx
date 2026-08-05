import type { BudgetCategory, Expense } from "@/lib/types";
import { BudgetCategoryList } from "@/components/budget/budget-category-list";
import { BudgetSummary } from "@/components/budget/budget-summary";
import { ExpenseForm } from "@/components/budget/expense-form";
import { ExpenseTable } from "@/components/budget/expense-table";
import { Card } from "@/components/ui/card";

type BudgetWorkspaceProps = {
  categories: BudgetCategory[];
  expenses: Expense[];
};

export function BudgetWorkspace({ categories, expenses }: BudgetWorkspaceProps) {
  return (
    <section className="min-w-0 space-y-5" id="budget">
      <BudgetSummary categories={categories} expenses={expenses} />
      <div className="grid min-w-0 gap-5 2xl:grid-cols-[0.9fr_1.1fr]">
        <BudgetCategoryList categories={categories} expenses={expenses} />
        <ExpenseForm categories={categories} />
      </div>
      <Card title="Daily Cost Table" eyebrow="Expenses">
        <ExpenseTable expenses={expenses} />
      </Card>
    </section>
  );
}
