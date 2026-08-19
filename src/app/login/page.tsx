import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  LockKeyhole,
  Mail,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Life Pilot AI",
  description: "Login to your Life Pilot AI workspace.",
};

const previewItems = [
  {
    title: "Budget guardrail",
    detail: "82% monthly health",
    icon: WalletCards,
  },
  {
    title: "Focus reserved",
    detail: "3h 20m planned today",
    icon: CalendarCheck,
  },
  {
    title: "AI summary",
    detail: "3 useful actions ready",
    icon: Bot,
  },
];

export default function LoginPage() {
  return (
    <main className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="grid h-full gap-4 px-0 py-0 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="flex min-h-0 items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-md">
            <Link className="mb-5 flex w-fit items-center gap-3" href="/">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white">
                AI
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Life Pilot
                </span>
                <span className="block text-base font-semibold text-slate-950">
                  AI Planner
                </span>
              </span>
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-semibold text-emerald-700">
                Welcome back
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Login to your account
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Open your budget, routine, tasks, and AI planning workspace.
              </p>

              <div className="mt-6 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">
                    Email address
                  </span>
                  <span className="relative block">
                    <Mail
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />
                    <input
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20"
                      name="email"
                      placeholder="you@example.com"
                      required
                      type="email"
                    />
                  </span>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">
                    Password
                  </span>
                  <span className="relative block">
                    <LockKeyhole
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                      strokeWidth={2}
                    />
                    <input
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20"
                      name="password"
                      placeholder="Enter your password"
                      required
                      type="password"
                    />
                  </span>
                </label>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex min-w-0 items-center gap-2 text-slate-600">
                    <input
                      className="size-4 rounded border-slate-300 text-emerald-600"
                      name="remember"
                      type="checkbox"
                    />
                    <span className="truncate">Remember me</span>
                  </label>
                  <Link
                    className="shrink-0 font-semibold text-emerald-700 hover:text-emerald-800"
                    href="/login"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Link
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  href="/dashboard"
                >
                  Login
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={2}
                  />
                </Link>
              </div>

              <p className="mt-4 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                  href="/register"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="hidden min-h-0 items-stretch lg:flex">
          <div className="login-money-panel relative h-full w-full overflow-hidden bg-emerald-600 p-3 text-white shadow-2xl xl:p-4 2xl:p-5">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_260px_at_18%_10%,rgba(255,255,255,0.14),transparent_62%),radial-gradient(520px_320px_at_86%_76%,rgba(6,95,70,0.26),transparent_60%),linear-gradient(135deg,#059669_0%,#047857_50%,#065f46_100%)]"
              aria-hidden="true"
            />

            <div className="relative flex h-full flex-col justify-center gap-3 xl:gap-3.5">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white">
                  <Bot aria-hidden="true" className="size-4" strokeWidth={2} />
                  Today preview
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 font-mono text-xs font-bold text-emerald-700">
                  LIVE
                </span>
              </div>

              <div className="rounded-3xl border border-white/18 bg-emerald-950/30 p-4 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.85)] backdrop-blur xl:p-5">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.16em] text-emerald-100/70">
                      Monthly guardrail
                    </p>
                    <p className="mt-3 text-5xl font-semibold leading-none">
                      82%
                    </p>
                    <p className="mt-2 text-sm text-emerald-50/80">
                      BDT 2,400 should stay reserved
                    </p>
                  </div>
                  <div className="login-budget-ring grid size-20 place-items-center rounded-full xl:size-22">
                    <span className="rounded-full bg-emerald-950 px-3 py-1.5 text-sm font-bold text-emerald-50">
                      Safe
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-7 items-end gap-2">
                  {[34, 48, 36, 58, 44, 68, 52].map((height, index) => (
                    <span
                      className="login-budget-bar rounded-t-lg bg-emerald-300/55"
                      key={index}
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-2.5 xl:gap-3">
                {previewItems.map(({ title, detail, icon: Icon }) => (
                  <div
                    className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-white/14 bg-emerald-950/25 p-2.5 shadow-[0_18px_56px_-42px_rgba(0,0,0,0.85)] backdrop-blur xl:min-h-[72px] xl:gap-3.5 xl:p-3"
                    key={title}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/12 text-emerald-50 xl:size-10">
                      <Icon
                        aria-hidden="true"
                        className="size-4 xl:size-5"
                        strokeWidth={2}
                      />
                    </span>
                    <span>
                      <b className="block text-sm font-semibold">{title}</b>
                      <small className="mt-0.5 block text-xs text-emerald-50/70">
                        {detail}
                      </small>
                    </span>
                    <ShieldCheck
                      aria-hidden="true"
                      className="ml-auto size-4 text-white/85 xl:size-5"
                      strokeWidth={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
