"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  FileText,
  ListChecks,
  ReceiptText,
  Sparkles,
  Tags,
  WalletCards,
} from "lucide-react";
import { SharedCard } from "@/components/shared/card";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBudgetUsage, getTotalSpent } from "@/lib/calculations";
import type { BudgetCategory, LifeNote, RoutineTask } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type AssistantView = "summary" | "money" | "reminders" | "expenses";

type ExtractedAmount = {
  id: string;
  noteTitle: string;
  amount: number;
  context: string;
};

type DraftExpense = {
  id: string;
  itemName: string;
  amount: number;
  category: string;
  sourceNote: string;
};

const moneyTerms = [
  "budget",
  "bajar",
  "cost",
  "expense",
  "spend",
  "spent",
  "payment",
  "paid",
  "bill",
  "balance",
  "cash",
  "card",
  "bdt",
  "tk",
  "taka",
];

const reminderTerms = [
  "reminder",
  "remember",
  "due",
  "call",
  "pickup",
  "review",
  "after",
  "before",
  "tomorrow",
  "night",
  "today",
  "medicine",
];

const assistantViews: Array<{ id: AssistantView; label: string; Icon: typeof Sparkles }> = [
  { id: "summary", label: "Daily brief", Icon: Sparkles },
  { id: "money", label: "Money clues", Icon: WalletCards },
  { id: "reminders", label: "Reminders", Icon: ListChecks },
  { id: "expenses", label: "Draft rows", Icon: ReceiptText },
];

function noteText(note: LifeNote) {
  return `${note.title} ${note.body} ${note.tags.join(" ")}`.toLowerCase();
}

function hasAnyTerm(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function getMatchedCategory(note: LifeNote, categories: BudgetCategory[]) {
  const text = noteText(note);
  return categories.find((category) => text.includes(category.name.toLowerCase()))?.name ?? categories[0]?.name ?? "Uncategorized";
}

function extractAmounts(notes: LifeNote[]) {
  return notes.flatMap((note) => {
    const text = `${note.title}. ${note.body}`;
    const matches = Array.from(text.matchAll(/(?:bdt|tk|taka|৳)?\s*(\d{2,}(?:,\d{3})*(?:\.\d+)?)/gi));

    return matches.map<ExtractedAmount>((match, index) => {
      const rawAmount = match[1]?.replaceAll(",", "") ?? "0";
      const start = Math.max((match.index ?? 0) - 28, 0);
      const end = Math.min((match.index ?? 0) + match[0].length + 28, text.length);

      return {
        id: `${note.id}-${index}`,
        noteTitle: note.title,
        amount: Number(rawAmount),
        context: text.slice(start, end).trim(),
      };
    });
  });
}

function getDraftExpenses(notes: LifeNote[], categories: BudgetCategory[]) {
  return notes.flatMap((note) => {
    const lines = `${note.title}\n${note.body}`
      .split(/\r?\n|,/)
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.flatMap<DraftExpense>((line, index) => {
      const amountMatch = line.match(/(?:bdt|tk|taka|৳)?\s*(\d{2,}(?:,\d{3})*(?:\.\d+)?)\s*$/i);

      if (!amountMatch) {
        return [];
      }

      const amount = Number(amountMatch[1].replaceAll(",", ""));
      const itemName = line.slice(0, amountMatch.index).replace(/[-:]+$/, "").trim();

      if (!itemName || amount <= 0) {
        return [];
      }

      return [
        {
          id: `${note.id}-row-${index}`,
          itemName,
          amount,
          category: getMatchedCategory(note, categories),
          sourceNote: note.title,
        },
      ];
    });
  });
}

function getUpcomingTasks(tasks: RoutineTask[]) {
  return tasks.filter((task) => ["pending", "active", "delayed", "missed"].includes(task.status)).slice(0, 3);
}

function MetricTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 truncate font-mono text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 truncate text-sm text-slate-500">{detail}</p>
    </div>
  );
}

function InsightRow({
  icon: Icon,
  title,
  detail,
  tone = "neutral",
}: {
  icon: typeof Sparkles;
  title: string;
  detail: string;
  tone?: "neutral" | "warning" | "success";
}) {
  return (
    <div className="flex min-w-0 gap-3 rounded-md border border-slate-200 bg-white p-3">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md",
          tone === "warning" && "bg-amber-50 text-amber-600",
          tone === "success" && "bg-emerald-50 text-emerald-600",
          tone === "neutral" && "bg-blue-50 text-blue-600",
        )}
      >
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="break-words text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 break-words text-sm leading-6 text-slate-600">{detail}</p>
      </div>
    </div>
  );
}

export function NotesAiAssistant() {
  const { categories, expenses, notes, settings, tasks } = useLifeOs();
  const [activeView, setActiveView] = useState<AssistantView>("summary");

  const analysis = useMemo(() => {
    const budgetUsage = getBudgetUsage(categories, expenses);
    const totalSpent = getTotalSpent(expenses);
    const totalBudget = budgetUsage.reduce((total, category) => total + category.monthlyLimit, 0);
    const remaining = totalBudget - totalSpent;
    const moneyNotes = notes.filter((note) => hasAnyTerm(noteText(note), moneyTerms));
    const reminderNotes = notes.filter((note) => hasAnyTerm(noteText(note), reminderTerms));
    const amounts = extractAmounts(notes);
    const draftExpenses = getDraftExpenses(notes, categories);
    const pressureCategories = budgetUsage
      .filter((category) => category.percent >= 70 || category.isOverBudget)
      .sort((a, b) => b.percent - a.percent);
    const topCategory = [...budgetUsage].sort((a, b) => b.spent - a.spent)[0];
    const upcomingTasks = getUpcomingTasks(tasks);
    const sourceCounts = expenses.reduce<Record<string, number>>((counts, expense) => {
      counts[expense.sourceType] = (counts[expense.sourceType] ?? 0) + 1;
      return counts;
    }, {});
    const tagCounts = notes.reduce<Record<string, number>>((counts, note) => {
      note.tags.forEach((tag) => {
        counts[tag] = (counts[tag] ?? 0) + 1;
      });
      return counts;
    }, {});
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      amounts,
      budgetUsage,
      draftExpenses,
      moneyNotes,
      pressureCategories,
      remaining,
      reminderNotes,
      sourceCounts,
      topCategory,
      topTags,
      totalBudget,
      totalSpent,
      upcomingTasks,
    };
  }, [categories, expenses, notes, tasks]);

  const hasNotes = notes.length > 0;
  const assistantStatus = settings.aiProvider === "off" ? "Local review" : settings.aiProvider;

  return (
    <SharedCard className="overflow-hidden !p-0">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <Bot aria-hidden="true" className="size-4" />
              </span>
              <p className="text-xs font-semibold uppercase text-emerald-600">AI Notes Assistant</p>
              <Badge tone="neutral">{assistantStatus}</Badge>
            </div>
            <h2 className="mt-3 break-words text-lg font-semibold text-slate-950">Review notes with money context</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Notes, expenses, budget categories, routine tasks, and file-sourced records are reviewed together before anything changes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {assistantViews.map(({ id, label, Icon }) => (
              <Button
                className={cn(
                  "h-9 flex-1 border px-3 min-[520px]:flex-none",
                  activeView === id
                    ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
                icon={<Icon aria-hidden="true" className="size-4" />}
                key={id}
                onClick={() => setActiveView(id)}
                type="button"
                variant="outline"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-0 2xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-5 p-4">
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <MetricTile detail="Saved in notes" label="Notes" value={String(notes.length)} />
            <MetricTile detail="Matched by tags or text" label="Money notes" value={String(analysis.moneyNotes.length)} />
            <MetricTile detail="Need review before saving" label="Draft rows" value={String(analysis.draftExpenses.length)} />
            <MetricTile detail="Across tracked expenses" label="Spent" value={formatCurrency(analysis.totalSpent)} />
          </div>

          {activeView === "summary" && (
            <div className="grid gap-3">
              <InsightRow
                detail={
                  hasNotes
                    ? `${analysis.moneyNotes.length} of ${notes.length} notes look related to budget, spending, payment, or bajar planning.`
                    : "No saved notes yet."
                }
                icon={FileText}
                title="Notes summary"
                tone="success"
              />
              <InsightRow
                detail={
                  analysis.topCategory
                    ? `${analysis.topCategory.name} has the highest tracked spend at ${formatCurrency(analysis.topCategory.spent)}. Remaining total balance is ${formatCurrency(analysis.remaining)}.`
                    : "No budget categories are available."
                }
                icon={WalletCards}
                title="Money context"
                tone={analysis.remaining < 0 ? "warning" : "neutral"}
              />
              <InsightRow
                detail={
                  analysis.upcomingTasks.length > 0
                    ? analysis.upcomingTasks.map((task) => `${task.title} (${task.status})`).join(", ")
                    : "No pending routine items need attention."
                }
                icon={ListChecks}
                title="Today queue"
              />
            </div>
          )}

          {activeView === "money" && (
            <div className="grid gap-3">
              {analysis.moneyNotes.length > 0 ? (
                analysis.moneyNotes.slice(0, 4).map((note) => (
                  <InsightRow
                    detail={note.body}
                    icon={WalletCards}
                    key={note.id}
                    title={`${note.title} -> ${getMatchedCategory(note, categories)}`}
                    tone="success"
                  />
                ))
              ) : (
                <InsightRow
                  detail="No saved note currently mentions budget, payment, balance, cost, or spending terms."
                  icon={WalletCards}
                  title="No money notes found"
                />
              )}
              {analysis.pressureCategories.length > 0 && (
                <InsightRow
                  detail={analysis.pressureCategories
                    .map((category) => `${category.name}: ${category.percent}% used`)
                    .join(", ")}
                  icon={AlertTriangle}
                  title="Budget pressure"
                  tone="warning"
                />
              )}
            </div>
          )}

          {activeView === "reminders" && (
            <div className="grid gap-3">
              {analysis.reminderNotes.length > 0 ? (
                analysis.reminderNotes.slice(0, 4).map((note) => (
                  <InsightRow detail={note.body} icon={ListChecks} key={note.id} title={note.title} />
                ))
              ) : (
                <InsightRow
                  detail="No saved note currently looks like a reminder or follow-up."
                  icon={ListChecks}
                  title="No reminder notes found"
                />
              )}
              <InsightRow
                detail={
                  analysis.upcomingTasks.length > 0
                    ? analysis.upcomingTasks.map((task) => `${task.plannedStart} ${task.title}`).join(", ")
                    : "Routine queue is clear."
                }
                icon={Sparkles}
                title="Connected routine"
                tone="success"
              />
            </div>
          )}

          {activeView === "expenses" && (
            <div className="overflow-hidden rounded-md border border-slate-200">
              <div className="grid min-w-[620px] grid-cols-[1.2fr_0.8fr_0.8fr_1fr] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                <span>Item</span>
                <span>Category</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Source note</span>
              </div>
              <div className="max-h-[320px] min-w-[620px] overflow-y-auto">
                {analysis.draftExpenses.length > 0 ? (
                  analysis.draftExpenses.map((row) => (
                    <div
                      className="grid grid-cols-[1.2fr_0.8fr_0.8fr_1fr] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
                      key={row.id}
                    >
                      <span className="min-w-0 truncate text-sm font-semibold text-slate-900">{row.itemName}</span>
                      <Badge tone="teal">{row.category}</Badge>
                      <span className="text-right font-mono text-sm font-semibold text-slate-900">
                        {formatCurrency(row.amount)}
                      </span>
                      <span className="min-w-0 truncate text-right text-sm text-slate-500">{row.sourceNote}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    No amount-ending note lines are ready for expense review.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="min-w-0 border-t border-slate-100 bg-white p-4 2xl:border-l 2xl:border-t-0">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Connected context</p>
              <h3 className="mt-1 text-base font-semibold text-slate-950">What this review uses</h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <WalletCards aria-hidden="true" className="size-4 text-emerald-600" />
                  Balance
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {formatCurrency(analysis.remaining)} remaining from {formatCurrency(analysis.totalBudget)} planned.
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FileText aria-hidden="true" className="size-4 text-blue-600" />
                  Files
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {analysis.sourceCounts.text ?? 0} text-imported and {analysis.sourceCounts.image ?? 0} image-sourced expense records.
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Tags aria-hidden="true" className="size-4 text-amber-600" />
                  Tags
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.topTags.length > 0 ? (
                    analysis.topTags.map(([tag, count]) => (
                      <Badge key={tag} tone="neutral">
                        {tag} {count}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">No tags yet</span>
                  )}
                </div>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ReceiptText aria-hidden="true" className="size-4 text-emerald-600" />
                  Loose amounts
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {analysis.amounts.length > 0
                    ? `${analysis.amounts.length} amount mentions found in saved notes.`
                    : "No unsaved amount mentions found in notes."}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </SharedCard>
  );
}

export function NotesAiAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Button
        icon={<Bot aria-hidden="true" className="size-4" />}
        onClick={() => setIsOpen(true)}
        type="button"
        variant="outline"
      >
        AI review
      </Button>
      <DialogContent className="!left-auto !right-0 !top-0 flex h-dvh !w-full max-w-[760px] !translate-x-0 !translate-y-0 grid-rows-none flex-col gap-0 overflow-hidden rounded-none border-y-0 border-r-0 p-0 sm:!w-[min(88vw,760px)]">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-4 py-4">
          <DialogTitle>AI notes review</DialogTitle>
          <DialogDescription>
            Review saved notes with money, file, balance, expense, and routine context.
          </DialogDescription>
        </DialogHeader>
        <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-4">
          <NotesAiAssistant />
        </div>
      </DialogContent>
    </Dialog>
  );
}
