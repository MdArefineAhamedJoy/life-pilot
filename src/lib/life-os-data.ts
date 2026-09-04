import type {
  AlertItem,
  BudgetCategory,
  Expense,
  LifeNote,
  LifeNoteSection,
  LifeSettings,
  RoutineTask,
  TimerSession,
} from "@/lib/types";

// New accounts start empty. All user-created data is loaded from the API.
export const budgetCategories: BudgetCategory[] = [];
export const expenses: Expense[] = [];
export const routineTasks: RoutineTask[] = [];
export const alerts: AlertItem[] = [];
export const lifeSections: LifeNoteSection[] = [];
export const timerSessions: TimerSession[] = [];
export const notes: LifeNote[] = [];

export const settings: LifeSettings = {
  profileName: "",
  profileEmail: "",
  profilePhone: "",
  profileLocation: "",
  profileRole: "",
  profileBio: "",
  profileImage: "",
  currency: "BDT",
  notificationEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  aiProvider: "off",
};
