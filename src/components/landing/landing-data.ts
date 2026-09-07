import {
  Bot,
  BrainCircuit,
  CalendarCheck,
  FileText,
  Goal,
  LockKeyhole,
  NotebookText,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Timer,
  WalletCards,
} from "lucide-react";

export const navItems = [
  { label: "Platform", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Security", href: "#security" },
];

export const proofPoints = [
  "No credit card required",
  "Local-first MVP",
  "AI stays optional",
];

export const signalCards: Array<{ label: string; value: string; detail: string; tone: string }> = [];

export const features = [
  {
    title: "AI daily briefing",
    description:
      "Summarize priorities, reminders, budget movement, and routine gaps before the day starts.",
    icon: Bot,
  },
  {
    title: "Budget-aware planning",
    description:
      "Connect expenses and categories with daily choices so your plan knows the money context.",
    icon: WalletCards,
  },
  {
    title: "Routine intelligence",
    description:
      "Track habits, timers, meals, and health patterns without turning life into a spreadsheet.",
    icon: BrainCircuit,
  },
  {
    title: "Smart capture",
    description:
      "Collect notes, receipts, goals, family tasks, and shopping items into one planning system.",
    icon: ScanLine,
  },
];

export const modules = [
  {
    title: "Budget",
    icon: WalletCards,
    detail: "Categories, expenses, and monthly guardrails.",
  },
  {
    title: "Routine",
    icon: CalendarCheck,
    detail: "Daily habits, plans, and recurring blocks.",
  },
  {
    title: "Timer",
    icon: Timer,
    detail: "Focus sessions with practical history.",
  },
  {
    title: "Notes",
    icon: NotebookText,
    detail: "Personal thoughts and quick capture.",
  },
  { title: "Goals", icon: Goal, detail: "Milestones tied to weekly action." },
  {
    title: "Reports",
    icon: FileText,
    detail: "Readable summaries across life data.",
  },
];

export const workflow = [
  {
    title: "Capture",
    description:
      "Add expenses, notes, reminders, routines, and tasks during the day.",
  },
  {
    title: "Analyze",
    description:
      "Life Pilot AI detects drift, conflicts, pressure points, and useful next actions.",
  },
  {
    title: "Decide",
    description:
      "Review one clean plan with money, time, and personal goals in the same context.",
  },
  {
    title: "Execute",
    description:
      "Open the working dashboard and move through your day without switching tools.",
  },
];

export const dashboardRows: Array<{ title: string; detail: string; time: string }> = [];

export const prompts = [
  "What should I prioritize before 6 PM?",
  "Why did my grocery budget jump this week?",
  "Suggest a calmer routine for exam days.",
  "Turn these notes into a weekend plan.",
];

export const securityItems = [
  {
    title: "Optional AI",
    detail: "The assistant is a helper layer, not hidden automation.",
    icon: Sparkles,
  },
  {
    title: "Local-first flow",
    detail:
      "The MVP keeps personal planning data understandable and controlled.",
    icon: LockKeyhole,
  },
  {
    title: "Reviewable output",
    detail: "Suggestions stay visible before they affect budgets or plans.",
    icon: ShieldCheck,
  },
];
