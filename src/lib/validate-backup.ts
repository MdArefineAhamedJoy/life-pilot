import type { LifeOsState } from "@/lib/types";

export function validateBackup(value: unknown): LifeOsState {
  if (!value || typeof value !== "object")
    throw new Error("Choose a valid Life Pilot JSON backup.");
  const state = value as LifeOsState;
  for (const key of ["categories", "expenses", "tasks", "timerSessions", "notes"] as const) {
    if (
      !Array.isArray(state[key]) ||
      state[key].some((row) => !row || typeof row !== "object" || typeof row.id !== "string")
    ) {
      throw new Error(`The backup has an invalid ${key} collection. Nothing was imported.`);
    }
  }
  if (!state.settings || typeof state.settings !== "object" || Array.isArray(state.settings)) {
    throw new Error("The backup must include settings. Nothing was imported.");
  }
  // Imported backups may belong to a different user. Do not reuse globally unique row IDs.
  const taskIds = new Map(state.tasks.map((task) => [task.id, `task-${crypto.randomUUID()}`]));
  return {
    ...state,
    categories: state.categories.map((row) => ({ ...row, id: `cat-${crypto.randomUUID()}` })),
    expenses: state.expenses.map((row) => ({ ...row, id: `expense-${crypto.randomUUID()}` })),
    tasks: state.tasks.map((row) => ({ ...row, id: taskIds.get(row.id)! })),
    timerSessions: state.timerSessions.map((row) => ({
      ...row,
      id: `timer-${crypto.randomUUID()}`,
      taskId: row.taskId ? taskIds.get(row.taskId) : undefined,
    })),
    notes: state.notes.map((row) => ({ ...row, id: `note-${crypto.randomUUID()}` })),
  };
}
