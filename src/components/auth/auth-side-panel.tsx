import { Bot, CalendarCheck, CheckCircle2, Sparkles } from "lucide-react";

const panelItems = [
  {
    title: "Daily plan",
    detail: "Tasks, meals, budget, and reminders in one clean view.",
    Icon: CalendarCheck,
  },
  {
    title: "AI assist",
    detail: "Ask for a quick summary before you start the day.",
    Icon: Bot,
  },
  {
    title: "Private workspace",
    detail: "Built for personal planning, not public sharing.",
    Icon: CheckCircle2,
  },
];

export function AuthSidePanel() {
  return (
    <section className="hidden min-h-0 items-center justify-center overflow-hidden bg-slate-950 p-8 text-white lg:flex">
      <div className="w-full max-w-lg">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold text-emerald-100">
          <Sparkles aria-hidden="true" className="size-4" strokeWidth={2} />
          Life Pilot workspace
        </div>

        <h2 className="mt-6 text-4xl font-semibold leading-tight">
          Organize the day before it starts.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
          Keep routine, money, tasks, notes, and AI decisions in one focused
          personal system.
        </p>

        <div className="mt-8 grid gap-3">
          {panelItems.map(({ title, detail, Icon }) => (
            <div
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-4"
              key={title}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-400/15 text-emerald-200">
                <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  {title}
                </span>
                <span className="mt-1 block text-sm leading-5 text-slate-300">
                  {detail}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
