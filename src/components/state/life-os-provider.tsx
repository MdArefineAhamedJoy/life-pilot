"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  budgetCategories,
  expenses,
  notes,
  routineTasks,
  settings,
  timerSessions,
} from "@/lib/life-os-data";
import { lifeOsStateService } from "@/services/life-os-state.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { replaceLifeOsState } from "@/store/life-os-slice";
import type {
  BudgetCategory,
  Expense,
  LifeNote,
  LifeSettings,
  LifeOsState,
  RoutineStatus,
  RoutineTask,
  TimerSession,
} from "@/lib/types";

type ParsedExpenseRow = {
  itemName: string;
  category: string;
  amount: number;
  quantity?: number;
};

type LifeOsContextValue = LifeOsState & {
  addBudgetCategory: (category: Omit<BudgetCategory, "id">) => void;
  updateBudgetCategory: (categoryId: string, nextCategory: Omit<BudgetCategory, "id">) => void;
  deleteBudgetCategory: (categoryId: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  addExpensesFromRows: (rows: ParsedExpenseRow[], date?: string) => void;
  deleteExpense: (expenseId: string) => void;
  updateCategoryLimit: (categoryId: string, monthlyLimit: number) => void;
  addTask: (task: Omit<RoutineTask, "id" | "status" | "repeatRule"> & Partial<Pick<RoutineTask, "status" | "repeatRule">>) => void;
  updateTask: (taskId: string, nextTask: Partial<Omit<RoutineTask, "id">>) => void;
  updateTaskStatus: (taskId: string, status: RoutineStatus) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (orderedTaskIds: string[]) => void;
  addTimerSession: (session: Omit<TimerSession, "id" | "createdAt">) => void;
  addNote: (note: Pick<LifeNote, "title" | "body"> & { tags?: string[] }) => void;
  updateNote: (noteId: string, nextNote: Pick<LifeNote, "title" | "body"> & { tags?: string[] }) => void;
  deleteNote: (noteId: string) => void;
  updateSettings: (nextSettings: Partial<LifeSettings>) => void;
  restoreData: (nextState: Partial<LifeOsState>) => void;
  resetData: () => void;
};

// Bump the key so old browser demo data is never used as an offline fallback.
const storageKey = "life-pilot-state-v2";

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
    if (!saved) {
      return initialState;
    }

    const parsedState = JSON.parse(saved) as Partial<LifeOsState>;

    return {
      ...initialState,
      ...parsedState,
      settings: { ...initialState.settings, ...parsedState.settings },
    };
  } catch {
    return initialState;
  }
}

export function LifeOsProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((store) => store.lifeOs);
  const [isHydrated, setIsHydrated] = useState(false);

  const setState = useCallback(
    (nextState: LifeOsState | ((current: LifeOsState) => LifeOsState)) => {
      dispatch(replaceLifeOsState(typeof nextState === "function" ? nextState(state) : nextState));
    },
    [dispatch, state],
  );

  useEffect(() => {
    let isMounted = true;
    let activeController: AbortController | undefined;

    async function hydrateState() {
      activeController?.abort();
      const controller = new AbortController();
      activeController = controller;
      setIsHydrated(false);
      const localState = readInitialState();

      if (isMounted) {
        dispatch(replaceLifeOsState(localState));
      }

      try {
        const remoteState = await lifeOsStateService.get(controller.signal);

        if (isMounted) {
          dispatch(replaceLifeOsState({
            ...initialState,
            ...remoteState,
            settings: { ...initialState.settings, ...remoteState.settings },
          }));
        }
      } catch {
        // Keep the local offline state when the API is not running.
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    }

    void hydrateState();
    const onAuthChanged = () => void hydrateState();
    window.addEventListener("life-pilot:auth-changed", onAuthChanged);

    return () => {
      isMounted = false;
      activeController?.abort();
      window.removeEventListener("life-pilot:auth-changed", onAuthChanged);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(state));

    const timerId = window.setTimeout(() => {
      void lifeOsStateService.replace(state).catch(() => {
        // Local storage remains the fallback if the backend is unavailable.
      });
    }, 300);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isHydrated, state]);

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
        setState((current) => {
          const previousCategory = current.categories.find((category) => category.id === categoryId);

          return {
            ...current,
            categories: current.categories.map((category) =>
              category.id === categoryId ? { ...nextCategory, id: category.id } : category,
            ),
            expenses: current.expenses.map((expense) => {
              if (!previousCategory || expense.category !== previousCategory.name) {
                return expense;
              }

              return { ...expense, category: nextCategory.name };
            }),
          };
        });
      },
      deleteBudgetCategory: (categoryId) => {
        setState((current) => ({
          ...current,
          categories: current.categories.filter((category) => category.id !== categoryId),
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
              order: task.order ?? current.tasks.length + 1,
              status: task.status ?? "pending",
              repeatRule: task.repeatRule ?? "daily",
            },
            ...current.tasks,
          ],
        }));
      },
      updateTask: (taskId, nextTask) => {
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, ...nextTask } : task)),
        }));
      },
      updateTaskStatus: (taskId, status) => {
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status,
                  completedAt: status === "completed" ? new Date().toISOString() : task.completedAt,
                }
              : task,
          ),
        }));
      },
      deleteTask: (taskId) => {
        setState((current) => ({
          ...current,
          tasks: current.tasks.filter((task) => task.id !== taskId),
        }));
      },
      reorderTasks: (orderedTaskIds) => {
        const orderMap = new Map(orderedTaskIds.map((taskId, index) => [taskId, index + 1]));

        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) => ({
            ...task,
            order: orderMap.get(task.id) ?? task.order,
          })),
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
      updateNote: (noteId, nextNote) => {
        const timestamp = new Date().toISOString();
        setState((current) => ({
          ...current,
          notes: current.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  title: nextNote.title,
                  body: nextNote.body,
                  tags: nextNote.tags ?? [],
                  updatedAt: timestamp,
                }
              : note,
          ),
        }));
      },
      deleteNote: (noteId) => {
        setState((current) => ({
          ...current,
          notes: current.notes.filter((note) => note.id !== noteId),
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
    [setState, state],
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
