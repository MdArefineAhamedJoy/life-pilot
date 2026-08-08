import type { BudgetCategory, Expense } from "@/lib/types";
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
      <ExpenseForm categories={categories} />
      <Card title="Daily Cost Table" eyebrow="Expenses">
        <ExpenseTable expenses={expenses} />
      </Card>
    </section>
  );
}
