import type { Metadata } from "next";
import Link from "next/link";
import { Bot, CalendarCheck, ShieldCheck, WalletCards } from "lucide-react";
import { RegisterStepForm } from "@/components/auth/register-step-form";

export const metadata: Metadata = {
  title: "Register | Life Pilot AI",
  description: "Create your Life Pilot AI account.",
};

export default function RegisterPage() {
  return (
    <main className="h-dvh overflow-hidden bg-slate-50 text-slate-900">
      <div className="grid h-full lg:grid-cols-[0.95fr_1.05fr]">
        <section className="auth-register-brand hidden min-w-0 overflow-hidden bg-[#07111f] px-8 text-white lg:flex lg:items-center lg:justify-end">
          <div className="relative z-10 w-full max-w-[32rem]">
            <Link className="flex w-fit items-center gap-3 rounded-md" href="/">
              <span className="life-brand-logo grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-white">
                AI
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  Life Pilot
                </span>
                <span className="block truncate text-sm font-semibold text-white">
                  AI Planner
                </span>
              </span>
            </Link>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-emerald-200 shadow-[0_16px_40px_-30px_rgba(82,242,184,0.9)]">
              <ShieldCheck aria-hidden="true" className="size-3.5" strokeWidth={2} />
              Private life cockpit
            </div>

            <div className="auth-cockpit mt-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-[0_28px_80px_-50px_rgba(0,0,0,0.9)]">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Budget", value: "82%", Icon: WalletCards },
                  { label: "Routine", value: "91", Icon: CalendarCheck },
                  { label: "AI", value: "3", Icon: Bot },
                ].map(({ label, value, Icon }) => (
                  <div
                    className="auth-stat-card rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    key={label}
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-4 text-emerald-200"
                      strokeWidth={2}
                    />
                    <span className="mt-3 block text-2xl font-semibold text-white">
                      {value}
                    </span>
                    <span className="mt-1 block text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative mt-5 h-[200px] rounded-3xl border border-white/10 bg-[#0b1728] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="auth-signal-map absolute inset-0" aria-hidden="true" />
                <div className="auth-scan-line" aria-hidden="true" />
                <div className="relative grid h-full place-items-center">
                  <div className="auth-radar-ring grid size-30 place-items-center rounded-full border border-emerald-300/25 bg-emerald-300/10">
                    <span className="auth-core-orb" aria-hidden="true" />
                  </div>
                  <span className="auth-node left-[15%] top-[31%]">
                    <WalletCards aria-hidden="true" className="size-4" />
                  </span>
                  <span className="auth-node auth-node-delay-a right-[15%] top-[32%]">
                    <CalendarCheck aria-hidden="true" className="size-4" />
                  </span>
                  <span className="auth-node auth-node-delay-b bottom-[9%] left-[45%]">
                    <Bot aria-hidden="true" className="size-4" />
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {["Money guardrail", "Focus block", "AI review"].map(
                  (item, index) => (
                    <div className="flex items-center gap-3" key={item}>
                      <span className="w-24 text-[0.7rem] font-semibold text-slate-300">
                        {item}
                      </span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <span
                          className="auth-meter block h-full rounded-full bg-emerald-300"
                          style={{ animationDelay: `${index * 0.45}s` }}
                        />
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 min-w-0 items-center justify-center px-6 py-4 lg:px-10">
          <div className="w-full max-w-[19rem] sm:max-w-md">
            <div>
              <div className="lg:hidden">
                <Link
                  className="mx-auto mb-2 flex w-fit items-center gap-2 rounded-md sm:mb-4 sm:gap-3"
                  href="/"
                >
                  <span className="life-brand-logo grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-white sm:size-10">
                    AI
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      Life Pilot
                    </span>
                    <span className="block truncate text-base font-semibold text-slate-950">
                      AI Planner
                    </span>
                  </span>
                </Link>
              </div>
              <RegisterStepForm />

              <p className="mt-4 text-center text-sm text-slate-600">
                Have account?{" "}
                <Link className="font-semibold text-emerald-700 hover:text-emerald-800" href="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
