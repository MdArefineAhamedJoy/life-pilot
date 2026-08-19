import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, LockKeyhole, Mail, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Register | Life Pilot AI",
  description: "Create your Life Pilot AI account.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="mx-auto grid min-h-dvh max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="flex min-w-0 items-center justify-center py-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <Link className="flex w-fit items-center gap-3 rounded-md" href="/">
                <span className="flex size-10 items-center justify-center rounded-md bg-emerald-600 text-sm font-semibold text-white">
                  AI
                </span>
                <span>
                  <span className="block text-xs font-semibold text-emerald-700">Life Pilot</span>
                  <span className="block text-base font-semibold text-slate-950">AI Planner</span>
                </span>
              </Link>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-sm font-semibold text-blue-700">Start free</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950">Create your account</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Set up your AI planning workspace for budgets, routines, tasks, and personal reports.
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">Full name</span>
                  <span className="relative block">
                    <UserRound aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                    <input
                      className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20"
                      name="name"
                      placeholder="Your name"
                      required
                      type="text"
                    />
                  </span>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">Email address</span>
                  <span className="relative block">
                    <Mail aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                    <input
                      className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20"
                      name="email"
                      placeholder="you@example.com"
                      required
                      type="email"
                    />
                  </span>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-900">Password</span>
                  <span className="relative block">
                    <LockKeyhole aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" strokeWidth={2} />
                    <input
                      className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/20"
                      minLength={8}
                      name="password"
                      placeholder="At least 8 characters"
                      required
                      type="password"
                    />
                  </span>
                </label>

                <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                  <input className="mt-1 size-4 shrink-0 rounded border-slate-300 text-emerald-600" required type="checkbox" />
                  <span>I agree to use Life Pilot AI for personal planning and understand this prototype has no backend authentication yet.</span>
                </label>

                <Link
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  href="/dashboard"
                >
                  Create account
                  <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
                </Link>
              </div>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link className="font-semibold text-emerald-700 hover:text-emerald-800" href="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="hidden min-w-0 flex-col justify-between rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:flex">
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
            <Bot aria-hidden="true" className="size-4" strokeWidth={2} />
            AI setup preview
          </div>

          <div className="space-y-4">
            {[
              ["Profile", "Tell Life Pilot what matters this month."],
              ["Budget", "Connect spending categories to daily decisions."],
              ["Routine", "Turn habits into a plan you can actually follow."],
            ].map(([title, description], index) => (
              <div className="flex gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4" key={title}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-3xl font-semibold leading-tight text-slate-950">
              Build a personal AI workspace around your real life.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Start with the dashboard today, then layer in AI recommendations as your data becomes more useful.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
