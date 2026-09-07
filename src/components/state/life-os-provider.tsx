"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuthenticatedUser } from "@/components/auth/auth-gate";
import { lifeOsStateService } from "@/services/life-os-state.service";
import { categoriesService } from "@/services/categories.service";
import { expensesService } from "@/services/expenses.service";
import { tasksService } from "@/services/tasks.service";
import { timerSessionsService } from "@/services/timer-sessions.service";
import { notesService } from "@/services/notes.service";
import { settingsService } from "@/services/settings.service";
import { accountService } from "@/services/account.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initialLifeOsState, replaceLifeOsState } from "@/store/life-os-slice";
import { localDateKey } from "@/lib/utils";
import { validateBackup } from "@/lib/validate-backup";
import { WorkspaceSavingContext } from "@/lib/workspace-saving";
import type { BudgetCategory, Expense, LifeNote, LifeSettings, LifeOsState, RoutineStatus, RoutineTask, TimerSession } from "@/lib/types";

type ParsedExpenseRow = { itemName: string; category: string; amount: number; quantity?: number };
type LifeOsContextValue = LifeOsState & {
  addBudgetCategory: (category: Omit<BudgetCategory, "id">) => Promise<boolean>;
  updateBudgetCategory: (id: string, category: Omit<BudgetCategory, "id">) => Promise<boolean>;
  deleteBudgetCategory: (id: string) => Promise<boolean>;
  addExpense: (expense: Omit<Expense, "id">) => Promise<boolean>;
  addExpensesFromRows: (rows: ParsedExpenseRow[], date?: string) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  updateCategoryLimit: (id: string, limit: number) => Promise<boolean>;
  addTask: (task: Omit<RoutineTask, "id" | "status" | "repeatRule"> & Partial<Pick<RoutineTask, "status" | "repeatRule">>) => Promise<boolean>;
  updateTask: (id: string, task: Partial<Omit<RoutineTask, "id">>) => Promise<boolean>;
  updateTaskStatus: (id: string, status: RoutineStatus) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  reorderTasks: (ids: string[]) => Promise<boolean>;
  addTimerSession: (session: Omit<TimerSession, "id" | "createdAt">) => Promise<boolean>;
  addNote: (note: Pick<LifeNote, "title" | "body"> & { tags?: string[] }) => Promise<boolean>;
  updateNote: (id: string, note: Pick<LifeNote, "title" | "body"> & { tags?: string[] }) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  updateSettings: (settings: Partial<LifeSettings>) => Promise<boolean>;
  restoreData: (state: unknown) => Promise<boolean>;
  resetData: () => Promise<boolean>;
};
const LifeOsContext = createContext<LifeOsContextValue | null>(null);

export function LifeOsProvider({ children }: { children: ReactNode }) {
  const user = useAuthenticatedUser();
  return <UserWorkspace key={user?.id ?? "public"}>{children}</UserWorkspace>;
}

function UserWorkspace({ children }: { children: ReactNode }) {
  const user = useAuthenticatedUser();
  const dispatch = useAppDispatch();
  const state = useAppSelector((store) => store.lifeOs);
  const current = useRef(initialLifeOsState);
  const active = useRef(false);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(0);
  const [attempt, setAttempt] = useState(0);

  const commit = useCallback((next: LifeOsState) => {
    current.current = next;
    dispatch(replaceLifeOsState(next));
  }, [dispatch]);

  useEffect(() => {
    active.current = true;
    let cancelled = false;
    if (!user) return () => { active.current = false; };
    async function load() {
      try {
        // All collection reads are backed by the corresponding protected endpoints.
        const [categories, expenses, tasks, timerSessions, notes, settings, profile] = await Promise.all([
          categoriesService.list(), expensesService.list(), tasksService.list(),
          timerSessionsService.list(), notesService.list(), settingsService.get(), accountService.getProfile(),
        ]);
        if (cancelled) return;
        commit({ categories, expenses, tasks, timerSessions, notes, settings: {
          ...settings, profileName: profile.name ?? "", profileEmail: profile.email ?? "",
          profilePhone: profile.phone ?? "", profileLocation: profile.location ?? "",
          profileRole: profile.role ?? "", profileBio: profile.bio ?? "", profileImage: profile.imageUrl ?? "",
        } });
        setError("");
        setReady(true);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Your data could not be loaded.");
      }
    }
    void load();
    return () => { cancelled = true; active.current = false; };
  }, [user, commit, attempt]);

  const mutate = useCallback((operation: (state: LifeOsState) => Promise<LifeOsState>) => {
    if (!active.current || !user || !ready) return Promise.resolve(false);
    setPending((count) => count + 1);
    setError("");
    const result = queue.current.then(async () => {
      if (!active.current) return false;
      try {
        const next = await operation(current.current);
        if (!active.current) return false;
        commit(next);
        return true;
      } catch (cause) {
        if (active.current) setError(cause instanceof Error ? cause.message : "Changes were not saved. Please try again.");
        return false;
      } finally {
        if (active.current) setPending((count) => count - 1);
      }
    });
    queue.current = result;
    return result;
  }, [commit, ready, user]);

  const value = useMemo<LifeOsContextValue>(() => ({
    ...(user ? state : initialLifeOsState),
    addBudgetCategory: (payload) => mutate(async (s) => ({ ...s, categories: [...s.categories, await categoriesService.create(payload)] })),
    updateBudgetCategory: (id, payload) => mutate(async (s) => {
      const previous = s.categories.find((item) => item.id === id);
      const category = await categoriesService.update(id, payload);
      return { ...s, categories: s.categories.map((item) => item.id === id ? category : item),
        expenses: s.expenses.map((item) => previous && item.category === previous.name ? { ...item, category: category.name } : item) };
    }),
    deleteBudgetCategory: (id) => mutate(async (s) => {
      await categoriesService.remove(id);
      return { ...s, categories: s.categories.filter((item) => item.id !== id) };
    }),
    updateCategoryLimit: (id, limit) => mutate(async (s) => {
      const category = await categoriesService.updateLimit(id, limit);
      return { ...s, categories: s.categories.map((item) => item.id === id ? category : item) };
    }),
    addExpense: (payload) => mutate(async (s) => ({ ...s, expenses: [await expensesService.create(payload), ...s.expenses] })),
    addExpensesFromRows: (rows, date = localDateKey()) => mutate(async (s) => ({
      ...s, expenses: [...await expensesService.createBulk(rows, date), ...s.expenses],
    })),
    deleteExpense: (id) => mutate(async (s) => {
      await expensesService.remove(id);
      return { ...s, expenses: s.expenses.filter((item) => item.id !== id) };
    }),
    addTask: (payload) => mutate(async (s) => ({ ...s, tasks: [...s.tasks, await tasksService.create({
      ...payload, order: payload.order ?? s.tasks.length + 1, status: payload.status ?? "pending", repeatRule: payload.repeatRule ?? "daily",
    })] })),
    updateTask: (id, payload) => mutate(async (s) => {
      const task = await tasksService.update(id, payload);
      return { ...s, tasks: s.tasks.map((item) => item.id === id ? task : item) };
    }),
    updateTaskStatus: (id, status) => mutate(async (s) => {
      const task = await tasksService.updateStatus(id, status);
      return { ...s, tasks: s.tasks.map((item) => item.id === id ? task : item) };
    }),
    deleteTask: (id) => mutate(async (s) => {
      await tasksService.remove(id);
      return { ...s, tasks: s.tasks.filter((item) => item.id !== id) };
    }),
    reorderTasks: (ids) => mutate(async (s) => ({ ...s, tasks: await tasksService.reorder(ids) })),
    addTimerSession: (payload) => mutate(async (s) => ({ ...s, timerSessions: [await timerSessionsService.create(payload), ...s.timerSessions] })),
    addNote: (payload) => mutate(async (s) => ({ ...s, notes: [await notesService.create(payload), ...s.notes] })),
    updateNote: (id, payload) => mutate(async (s) => {
      const note = await notesService.update(id, payload);
      return { ...s, notes: s.notes.map((item) => item.id === id ? note : item) };
    }),
    deleteNote: (id) => mutate(async (s) => {
      await notesService.remove(id);
      return { ...s, notes: s.notes.filter((item) => item.id !== id) };
    }),
    updateSettings: (payload) => mutate(async (s) => ({ ...s, settings: await settingsService.update(payload) })),
    restoreData: (payload) => mutate(async () => lifeOsStateService.replace(validateBackup(payload))),
    resetData: () => mutate(async () => lifeOsStateService.reset()),
  }), [mutate, state, user]);

  if (user && !ready) return <div className="grid min-h-dvh place-content-center gap-4 bg-slate-50 p-6" aria-busy={!error}>
    <p role={error ? "alert" : "status"}>{error || "Loading your workspace…"}</p>
    {error && <button className="rounded bg-emerald-600 px-4 py-2 text-white" onClick={() => setAttempt((value) => value + 1)}>Try again</button>}
  </div>;
  return <LifeOsContext.Provider value={value}>
    {error && <div role="alert" className="fixed inset-x-4 top-3 z-[100] rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 shadow-lg">
      {error} <button className="ml-3 underline" onClick={() => setError("")}>Dismiss</button>
    </div>}
    {pending > 0 && <div role="status" className="fixed right-4 top-4 z-[100] rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Saving…</div>}
    <WorkspaceSavingContext.Provider value={pending > 0}>
      <fieldset disabled={pending > 0} className="contents">{children}</fieldset>
    </WorkspaceSavingContext.Provider>
  </LifeOsContext.Provider>;
}
export function useLifeOs() {
  const context = useContext(LifeOsContext);
  if (!context) throw new Error("useLifeOs must be used inside LifeOsProvider");
  return context;
}
