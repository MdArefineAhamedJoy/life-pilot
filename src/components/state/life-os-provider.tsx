"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  budgetCategories,
  expenses,
  notes,
  routineTasks,
  settings,
  timerSessions,
} from "@/lib/life-os-data";
import type {
  BudgetCategory,
  Expense,
  LifeNote,
  LifeSettings,
  RoutineStatus,
  RoutineTask,
  TimerSession,
} from "@/lib/types";

type LifeOsState = {
  categories: BudgetCategory[];
  expenses: Expense[];
  tasks: RoutineTask[];
  timerSessions: TimerSession[];
  notes: LifeNote[];
  settings: LifeSettings;
};

type ParsedExpenseRow = {
  itemName: string;
  category: string;
  amount: number;
  quantity?: number;
};

type LifeOsContextValue = LifeOsState & {
  addBudgetCategory: (category: Omit<BudgetCategory, "id">) => void;
  updateBudgetCategory: (categoryId: string, nextCategory: Omit<BudgetCategory, "id">) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  addExpensesFromRows: (rows: ParsedExpenseRow[], date?: string) => void;
  deleteExpense: (expenseId: string) => void;
  updateCategoryLimit: (categoryId: string, monthlyLimit: number) => void;
  addTask: (task: Omit<RoutineTask, "id" | "status" | "repeatRule"> & Partial<Pick<RoutineTask, "status" | "repeatRule">>) => void;
  updateTaskStatus: (taskId: string, status: RoutineStatus) => void;
  addTimerSession: (session: Omit<TimerSession, "id" | "createdAt">) => void;
  addNote: (note: Pick<LifeNote, "title" | "body"> & { tags?: string[] }) => void;
  updateSettings: (nextSettings: Partial<LifeSettings>) => void;
  restoreData: (nextState: Partial<LifeOsState>) => void;
  resetData: () => void;
};

const storageKey = "life-pilot-state-v1";

const initialState: LifeOsState = {
  categories: budgetCategories,
  expenses,
  tasks: routineTasks,
  timerSessions,
  notes,
  settings,
};

const LifeOsContext = createContext<LifeOsContextValue | null>(null);

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function readInitialState() {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
}

export function LifeOsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LifeOsState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setState(readInitialState());
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [isLoaded, state]);

  const value = useMemo<LifeOsContextValue>(
    () => ({
      ...state,
      addBudgetCategory: (category) => {
        setState((current) => ({
          ...current,
          categories: [{ ...category, id: createId("cat") }, ...current.categories],
        }));
      },
      updateBudgetCategory: (categoryId, nextCategory) => {
        setState((current) => ({
          ...current,
          categories: current.categories.map((category) =>
            category.id === categoryId ? { ...nextCategory, id: category.id } : category,
          ),
        }));
      },
      addExpense: (expense) => {
        setState((current) => ({
          ...current,
          expenses: [{ ...expense, id: createId("expense") }, ...current.expenses],
        }));
      },
      addExpensesFromRows: (rows, date = todayDate()) => {
        setState((current) => ({
          ...current,
          expenses: [
            ...rows
              .filter((row) => row.itemName.trim() && row.amount > 0)
              .map((row) => ({
                id: createId("expense"),
                date,
                itemName: row.itemName,
                category: row.category,
                amount: row.amount,
                quantity: row.quantity,
                sourceType: "text" as const,
              })),
            ...current.expenses,
          ],
        }));
      },
      deleteExpense: (expenseId) => {
        setState((current) => ({
          ...current,
          expenses: current.expenses.filter((expense) => expense.id !== expenseId),
        }));
      },
      updateCategoryLimit: (categoryId, monthlyLimit) => {
        setState((current) => ({
          ...current,
          categories: current.categories.map((category) =>
            category.id === categoryId ? { ...category, monthlyLimit } : category,
          ),
        }));
      },
      addTask: (task) => {
        setState((current) => ({
          ...current,
          tasks: [
            {
              ...task,
              id: createId("task"),
              status: task.status ?? "pending",
              repeatRule: task.repeatRule ?? "daily",
            },
            ...current.tasks,
          ],
        }));
      },
      updateTaskStatus: (taskId, status) => {
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
        }));
      },
      addTimerSession: (session) => {
        setState((current) => ({
          ...current,
          timerSessions: [
            {
              ...session,
              id: createId("timer"),
              createdAt: new Date().toISOString(),
            },
            ...current.timerSessions,
          ],
        }));
      },
      addNote: (note) => {
        const timestamp = new Date().toISOString();
        setState((current) => ({
          ...current,
          notes: [
            {
              id: createId("note"),
              title: note.title,
              body: note.body,
              tags: note.tags ?? [],
              createdAt: timestamp,
              updatedAt: timestamp,
            },
            ...current.notes,
          ],
        }));
      },
      updateSettings: (nextSettings) => {
        setState((current) => ({
          ...current,
          settings: { ...current.settings, ...nextSettings },
        }));
      },
      restoreData: (nextState) => {
        setState((current) => ({
          ...current,
          ...nextState,
          settings: { ...current.settings, ...nextState.settings },
        }));
      },
      resetData: () => setState(initialState),
    }),
    [state],
  );

  return <LifeOsContext.Provider value={value}>{children}</LifeOsContext.Provider>;
}

export function useLifeOs() {
  const context = useContext(LifeOsContext);

  if (!context) {
    throw new Error("useLifeOs must be used inside LifeOsProvider");
  }

  return context;
}
