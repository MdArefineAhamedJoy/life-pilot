import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { budgetCategories, expenses, notes, routineTasks, settings, timerSessions } from "@/lib/life-os-data";
import type { LifeOsState } from "@/lib/types";

export const initialLifeOsState: LifeOsState = {
  categories: budgetCategories,
  expenses,
  tasks: routineTasks,
  timerSessions,
  notes,
  settings,
};

const lifeOsSlice = createSlice({
  name: "lifeOs",
  initialState: initialLifeOsState,
  reducers: {
    replaceLifeOsState: (_, action: PayloadAction<LifeOsState>) => action.payload,
  },
});

export const { replaceLifeOsState } = lifeOsSlice.actions;
export default lifeOsSlice.reducer;
