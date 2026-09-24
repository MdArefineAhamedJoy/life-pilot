"use client";

import { MealPlanDialog } from "@/components/meals/meal-plan-dialog";
import { MealDetailsDialog } from "@/components/meals/meal-details-dialog";
import { StatCard } from "@/components/shared/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { localDateKey } from "@/lib/utils";
import { mealsService } from "@/services/meals.service";
import type { MealPlan, MealStatus, MealSummary, MealType } from "@/types/meal.types";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, MoreVertical, Plus, ShoppingBasket, Trash2, Utensils } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const mealOrder: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
const mealLabels: Record<MealType, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" };
const statusTone: Record<MealStatus, "success" | "amber" | "neutral"> = { prepared: "success", planned: "amber", skipped: "neutral" };

function dateAt(value: string) { return new Date(`${value}T12:00:00`); }
function dateKey(date: Date) { return date.toISOString().slice(0, 10); }
function addDays(value: string, days: number) { const date = dateAt(value); date.setDate(date.getDate() + days); return dateKey(date); }
function mondayOf(value: string) { const date = dateAt(value); date.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return dateKey(date); }
function dayLabel(value: string) { return new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short" }).format(dateAt(value)); }

export default function MealPlannerPage() {
  const [weekStart, setWeekStart] = useState(() => mondayOf(localDateKey()));
  const [meals, setMeals] = useState<MealPlan[]>([]);
  const [summary, setSummary] = useState<MealSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealPlan | undefined>();
  const [viewingMeal, setViewingMeal] = useState<MealPlan | undefined>();
  const [defaultDate, setDefaultDate] = useState<string | undefined>();
  const [openMenu, setOpenMenu] = useState<string | undefined>();
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart]);

  const load = useCallback(async () => {
    setIsLoading(true); setError("");
    try {
      const filters = { dateFrom: weekStart, dateTo: weekEnd };
      const [nextMeals, nextSummary] = await Promise.all([mealsService.list(filters), mealsService.summary(filters)]);
      setMeals(nextMeals); setSummary(nextSummary);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load meal plans."); }
    finally { setIsLoading(false); }
  }, [weekStart, weekEnd]);
  useEffect(() => {
    const reloadTimer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(reloadTimer);
  }, [load]);
  async function setStatus(id: string, status: MealStatus) { try { await mealsService.updateStatus(id, status); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update meal status."); } }
  async function remove(meal: MealPlan) {
    if (!window.confirm(`Delete “${meal.title}”? This cannot be undone.`)) return;
    try {
      await mealsService.remove(meal.id);
      setViewingMeal(undefined);
      setOpenMenu(undefined);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not remove meal.");
    }
  }
  function addMeal(date?: string) { setEditingMeal(undefined); setDefaultDate(date); setDialogOpen(true); }

  return <div className="min-w-0 space-y-6">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><SectionHeader eyebrow="Meal planner" title="Plan meals for the week" description="Turn meal ideas into an organised weekly plan with prep, nutrition, and shopping context." /><Button className="w-full sm:w-auto" icon={<Plus aria-hidden="true" className="size-4" />} onClick={() => addMeal()} type="button">Add meal</Button></div>
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"><Button icon={<ChevronLeft aria-hidden="true" className="size-4" />} onClick={() => setWeekStart((date) => addDays(date, -7))} type="button" variant="outline">Previous</Button><p className="min-w-[210px] flex-1 text-center text-sm font-semibold text-slate-800">{dayLabel(weekStart)} — {dayLabel(weekEnd)}</p><Button onClick={() => setWeekStart(mondayOf(localDateKey()))} type="button" variant="outline">This week</Button><Button icon={<ChevronRight aria-hidden="true" className="size-4" />} onClick={() => setWeekStart((date) => addDays(date, 7))} type="button" variant="outline">Next</Button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard detail="Meals in this week" icon={Utensils} label="Planned meals" progress={summary?.totalMeals ? Math.round(((summary.preparedMeals ?? 0) / summary.totalMeals) * 100) : 0} tone="blue" value={String(summary?.totalMeals ?? 0)} /><StatCard detail="Ready to serve" icon={CheckCircle2} label="Prepared" progress={summary?.totalMeals ? Math.round(((summary.preparedMeals ?? 0) / summary.totalMeals) * 100) : 0} tone="emerald" value={String(summary?.preparedMeals ?? 0)} /><StatCard detail="Total prep workload" icon={Clock3} label="Prep time" tone="amber" value={`${summary?.prepMinutes ?? 0}m`} /><StatCard detail="Meals with ingredients to buy" icon={ShoppingBasket} label="Shopping needs" tone="red" value={String(summary?.shoppingNeeded ?? 0)} /></div>
    {error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
    {isLoading ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><div className="h-56 animate-pulse rounded-lg bg-slate-200" /><div className="h-56 animate-pulse rounded-lg bg-slate-200" /><div className="h-56 animate-pulse rounded-lg bg-slate-200" /></div> : <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">{days.map((date) => <DayColumn dayMeals={meals.filter((meal) => meal.date === date)} date={date} key={date} onAdd={() => addMeal(date)} onDelete={remove} onEdit={(meal) => { setEditingMeal(meal); setDefaultDate(undefined); setDialogOpen(true); }} onPrepare={(id) => void setStatus(id, "prepared")} onView={setViewingMeal} openMenu={openMenu} setOpenMenu={setOpenMenu} />)}</div>}
    <MealPlanDialog defaultDate={defaultDate} meal={editingMeal} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingMeal(undefined); }} onSaved={() => void load()} open={dialogOpen} />
    <MealDetailsDialog meal={viewingMeal} onDelete={(meal) => void remove(meal)} onEdit={(meal) => { setViewingMeal(undefined); setEditingMeal(meal); setDialogOpen(true); }} onOpenChange={(open) => !open && setViewingMeal(undefined)} />
  </div>;
}

function DayColumn({ date, dayMeals, onAdd, onEdit, onDelete, onPrepare, onView, openMenu, setOpenMenu }: { date: string; dayMeals: MealPlan[]; onAdd: () => void; onEdit: (meal: MealPlan) => void; onDelete: (meal: MealPlan) => Promise<void>; onPrepare: (id: string) => void; onView: (meal: MealPlan) => void; openMenu?: string; setOpenMenu: (id?: string) => void }) {
  return <section className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm"><header className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><div><h2 className="font-semibold text-slate-900">{dayLabel(date)}</h2><p className="mt-0.5 text-xs text-slate-500">{dayMeals.length} meal{dayMeals.length === 1 ? "" : "s"} planned</p></div><button aria-label={`Add meal for ${dayLabel(date)}`} className="rounded-md p-2 text-emerald-600 hover:bg-emerald-50" onClick={onAdd} type="button"><Plus className="size-4" /></button></header><div className="min-h-40 space-y-3 p-3">{mealOrder.flatMap((mealType) => dayMeals.filter((meal) => meal.mealType === mealType)).map((meal) => <MealCard key={meal.id} meal={meal} onDelete={() => void onDelete(meal)} onEdit={() => onEdit(meal)} onMenu={() => setOpenMenu(openMenu === meal.id ? undefined : meal.id)} onPrepare={() => onPrepare(meal.id)} onView={() => onView(meal)} open={openMenu === meal.id} />)}{!dayMeals.length && <button className="flex min-h-32 w-full items-center justify-center rounded-md border border-dashed border-slate-200 text-sm font-medium text-slate-500 hover:border-emerald-300 hover:text-emerald-600" onClick={onAdd} type="button">Plan a meal</button>}</div></section>;
}

function MealCard({ meal, open, onMenu, onPrepare, onEdit, onDelete, onView }: { meal: MealPlan; open: boolean; onMenu: () => void; onPrepare: () => void; onEdit: () => void; onDelete: () => void; onView: () => void }) {
  return <article className="relative rounded-md border border-slate-200 bg-slate-50 p-3"><div className="flex items-start justify-between gap-2"><button className="min-w-0 text-left" onClick={onView} type="button"><div className="flex flex-wrap items-center gap-1.5"><p className="truncate text-sm font-semibold text-slate-900">{meal.title}</p><Badge tone={statusTone[meal.status]}>{meal.status}</Badge></div><p className="mt-1 text-xs font-medium text-emerald-700">{mealLabels[meal.mealType]}{meal.plannedTime ? ` · ${meal.plannedTime}` : ""} · {meal.servings} serving{meal.servings === 1 ? "" : "s"}</p></button><button aria-expanded={open} aria-label={`Actions for ${meal.title}`} className="rounded p-1 text-slate-500 hover:bg-white" onClick={onMenu} type="button"><MoreVertical className="size-4" /></button></div><div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">{meal.prepMinutes !== undefined && <span>{meal.prepMinutes} min prep</span>}{meal.calories !== undefined && <span>{meal.calories} kcal</span>}{meal.shoppingNeeded && <span className="font-medium text-amber-700">Need to buy</span>}</div>{meal.ingredients.length > 0 && <p className="mt-2 truncate text-xs text-slate-500">{meal.ingredients.join(", ")}</p>}{open && <div className="absolute right-2 top-10 z-10 w-36 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg"><button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50" onClick={onView} type="button">View details</button>{meal.status !== "prepared" && <button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 hover:text-emerald-600" onClick={onPrepare} type="button">Mark prepared</button>}<button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50" onClick={onEdit} type="button">Edit meal</button><button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50" onClick={onDelete} type="button"><Trash2 className="size-3.5" />Delete</button></div>}</article>;
}
