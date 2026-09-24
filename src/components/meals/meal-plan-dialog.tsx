"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { RichTextEditor } from "@/components/ui/rich-text";
import { localDateKey } from "@/lib/utils";
import { mealsService } from "@/services/meals.service";
import type { MealPlan, MealType } from "@/types/meal.types";
import { Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

type MealPlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal?: MealPlan;
  defaultDate?: string;
  onSaved: () => void;
};

export function MealPlanDialog({ open, onOpenChange, meal, defaultDate, onSaved }: MealPlanDialogProps) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = Boolean(meal);

  async function quickCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rawInput = String(new FormData(event.currentTarget).get("rawInput") ?? "");
    if (!rawInput.trim()) return setError("Write your meal plan first.");

    setIsSaving(true);
    setError("");
    try {
      await mealsService.organise(rawInput, defaultDate ?? localDateKey());
      onOpenChange(false);
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not organise the meal plan.");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!meal) return;
    const data = new FormData(event.currentTarget);
    setIsSaving(true);
    setError("");
    try {
      await mealsService.update(meal.id, {
        date: String(data.get("date")),
        mealType: String(data.get("mealType")) as MealType,
        title: String(data.get("title")),
        rawInput: String(data.get("rawInput")),
        plannedTime: String(data.get("plannedTime")),
        aiSummary: String(data.get("aiSummary")),
        servings: Number(data.get("servings")) || 1,
        prepMinutes: Number(data.get("prepMinutes")) || undefined,
        calories: Number(data.get("calories")) || undefined,
        proteinGrams: Number(data.get("proteinGrams")) || undefined,
        carbsGrams: Number(data.get("carbsGrams")) || undefined,
        fatGrams: Number(data.get("fatGrams")) || undefined,
        ingredients: String(data.get("ingredients") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
        shoppingNeeded: data.get("shoppingNeeded") === "on",
        note: String(data.get("note") ?? ""),
        status: meal.status,
      });
      onOpenChange(false);
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update the meal.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog onOpenChange={(nextOpen) => { onOpenChange(nextOpen); if (!nextOpen) setError(""); }} open={open}>
      <DialogContent className="!flex max-h-[calc(100dvh-2rem)] !w-[min(94vw,760px)] max-w-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-slate-200 px-5 py-4">
          <DialogTitle>{isEdit ? "Edit meal details" : "Create meal with AI"}</DialogTitle>
          <DialogDescription>{isEdit ? "Every organised detail is editable here." : "Write your plan naturally. AI will organise it into a clear meal record."}</DialogDescription>
        </DialogHeader>
        {isEdit ? <EditForm error={error} isSaving={isSaving} meal={meal!} onCancel={() => onOpenChange(false)} onSubmit={updateMeal} /> : <QuickForm error={error} isSaving={isSaving} onCancel={() => onOpenChange(false)} onSubmit={quickCreate} />}
      </DialogContent>
    </Dialog>
  );
}

function QuickForm({ error, isSaving, onCancel, onSubmit }: { error: string; isSaving: boolean; onCancel: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const [rawInput, setRawInput] = useState("");
  return (
    <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={onSubmit}>
      <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-4">
          <FieldShell label="Tell AI about your meal">
            <RichTextEditor name="rawInput" onChange={setRawInput} placeholder={"Example:\nAmi sokale dal bhuna abong porota khabo.\nAmi sokal 10tar modhe nasta korbo."} value={rawInput} />
          </FieldShell>
          <div className="rounded-md border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
            <Sparkles aria-hidden="true" className="mb-2 size-5" />
            <p className="font-semibold">AI meal organiser</p>
            <p className="mt-1 text-violet-800">It will arrange your note into a category, time, ingredients, and clear details. You can edit every field afterwards.</p>
          </div>
          {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>
      </div>
      <DialogFooter className="shrink-0 border-t border-slate-200 px-5 py-3">
        <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
          <Button onClick={onCancel} type="button" variant="outline">Cancel</Button>
          <Button disabled={isSaving} icon={<Sparkles aria-hidden="true" className="size-4" />} type="submit">{isSaving ? "Organising..." : "Organise meal"}</Button>
        </div>
      </DialogFooter>
    </form>
  );
}

function EditForm({ meal, error, isSaving, onCancel, onSubmit }: { meal: MealPlan; error: string; isSaving: boolean; onCancel: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const [rawInput, setRawInput] = useState(meal.rawInput ?? "");
  return (
    <form className="flex min-h-0 flex-1 flex-col overflow-hidden" onSubmit={onSubmit}>
      <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
          <div className="md:col-span-2"><FieldShell label="Original meal input"><RichTextEditor name="rawInput" onChange={setRawInput} placeholder="Write the original meal plan" value={rawInput} /></FieldShell></div>
          <FieldShell label="Meal title"><TextInput defaultValue={meal.title} name="title" required /></FieldShell>
          <FieldShell label="Date"><TextInput defaultValue={meal.date} name="date" required type="date" /></FieldShell>
          <FieldShell label="Meal category"><SelectInput defaultValue={meal.mealType} name="mealType"><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option></SelectInput></FieldShell>
          <FieldShell label="Planned time"><TextInput defaultValue={meal.plannedTime ?? ""} name="plannedTime" placeholder="10:00 AM" /></FieldShell>
          <div className="md:col-span-2"><FieldShell label="AI summary"><TextInput defaultValue={meal.aiSummary ?? ""} name="aiSummary" /></FieldShell></div>
          <FieldShell label="Servings"><TextInput defaultValue={meal.servings} min="1" name="servings" type="number" /></FieldShell>
          <FieldShell label="Preparation time (minutes)"><TextInput defaultValue={meal.prepMinutes ?? ""} min="0" name="prepMinutes" type="number" /></FieldShell>
          <FieldShell label="Calories per serving"><TextInput defaultValue={meal.calories ?? ""} min="0" name="calories" type="number" /></FieldShell>
          <FieldShell label="Protein (g)"><TextInput defaultValue={meal.proteinGrams ?? ""} min="0" name="proteinGrams" type="number" /></FieldShell>
          <FieldShell label="Carbs (g)"><TextInput defaultValue={meal.carbsGrams ?? ""} min="0" name="carbsGrams" type="number" /></FieldShell>
          <FieldShell label="Fat (g)"><TextInput defaultValue={meal.fatGrams ?? ""} min="0" name="fatGrams" type="number" /></FieldShell>
          <div className="md:col-span-2"><FieldShell label="Ingredients"><TextArea className="min-h-20" defaultValue={meal.ingredients.join(", ")} name="ingredients" /></FieldShell></div>
          <label className="flex min-h-9 items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700"><input defaultChecked={meal.shoppingNeeded} name="shoppingNeeded" type="checkbox" /> Add ingredients to shopping needs</label>
          <div className="md:col-span-2"><FieldShell label="Note"><TextArea className="min-h-20" defaultValue={meal.note ?? ""} name="note" /></FieldShell></div>
          {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 md:col-span-2">{error}</p>}
        </div>
      </div>
      <DialogFooter className="shrink-0 border-t border-slate-200 px-5 py-3">
        <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
          <Button onClick={onCancel} type="button" variant="outline">Cancel</Button>
          <Button disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Update meal"}</Button>
        </div>
      </DialogFooter>
    </form>
  );
}
