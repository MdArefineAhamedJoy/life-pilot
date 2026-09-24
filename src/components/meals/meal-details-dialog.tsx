"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormattedRichText } from "@/components/ui/rich-text";
import type { MealPlan } from "@/types/meal.types";
import { Clock3, Sparkles, Utensils } from "lucide-react";
import type { ReactNode } from "react";

const statusTone = { prepared: "success", planned: "amber", skipped: "neutral" } as const;

type MealDetailsDialogProps = {
  meal?: MealPlan;
  onDelete: (meal: MealPlan) => void;
  onEdit: (meal: MealPlan) => void;
  onOpenChange: (open: boolean) => void;
};

export function MealDetailsDialog({ meal, onDelete, onEdit, onOpenChange }: MealDetailsDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(meal)}>
      <DialogContent className="!flex max-h-[calc(100dvh-2rem)] !w-[min(94vw,680px)] max-w-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3 pr-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Utensils className="size-5" /></span>
            <div><DialogTitle>{meal?.title}</DialogTitle><DialogDescription>{meal?.date} · {meal?.mealType}</DialogDescription></div>
          </div>
        </DialogHeader>
        {meal && <div className="modal-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          <div className="flex flex-wrap gap-2"><Badge tone={statusTone[meal.status]}>{meal.status}</Badge>{meal.plannedTime && <Badge tone="indigo">{meal.plannedTime}</Badge>}{meal.shoppingNeeded && <Badge tone="warning">Shopping needed</Badge>}</div>
          {meal.aiSummary && <section className="rounded-md border border-violet-200 bg-violet-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-violet-900"><Sparkles className="size-4" /> Organised plan</div><p className="mt-2 text-sm text-violet-900">{meal.aiSummary}</p></section>}
          <div className="grid gap-3 sm:grid-cols-3"><Info label="Servings" value={String(meal.servings)} /><Info icon={<Clock3 className="size-4" />} label="Prep time" value={meal.prepMinutes !== undefined ? `${meal.prepMinutes} min` : "Not set"} /><Info label="Calories" value={meal.calories !== undefined ? `${meal.calories} kcal` : "Not set"} /></div>
          <div className="grid gap-3 sm:grid-cols-3"><Info label="Protein" value={meal.proteinGrams !== undefined ? `${meal.proteinGrams} g` : "—"} /><Info label="Carbs" value={meal.carbsGrams !== undefined ? `${meal.carbsGrams} g` : "—"} /><Info label="Fat" value={meal.fatGrams !== undefined ? `${meal.fatGrams} g` : "—"} /></div>
          {meal.ingredients.length > 0 && <section><h3 className="text-sm font-semibold text-slate-900">Ingredients</h3><div className="mt-2 flex flex-wrap gap-2">{meal.ingredients.map((item) => <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700" key={item}>{item}</span>)}</div></section>}
          {meal.rawInput && <section><h3 className="text-sm font-semibold text-slate-900">Your formatted input</h3><div className="mt-2 rounded-md bg-slate-50 p-3"><FormattedRichText value={meal.rawInput} /></div></section>}
          {meal.note && <section><h3 className="text-sm font-semibold text-slate-900">Note</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{meal.note}</p></section>}
        </div>}
        <DialogFooter className="shrink-0 border-t border-slate-200 px-5 py-3"><div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row"><Button onClick={() => onOpenChange(false)} type="button" variant="outline">Close</Button>{meal && <><Button onClick={() => onDelete(meal)} type="button" variant="outline">Delete meal</Button><Button onClick={() => onEdit(meal)} type="button">Edit meal</Button></>}</div></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return <div className="rounded-md border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">{icon}{value}</p></div>;
}
