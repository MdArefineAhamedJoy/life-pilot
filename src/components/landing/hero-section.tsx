import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

import { proofPoints } from "./landing-data";
import { GhostLink, PrimaryLink } from "./landing-primitives";

export function HeroSection() {
  return (
    <section className="life-hero-section relative flex min-h-screen items-center px-4 pb-16 pt-[86px] sm:px-6 lg:pb-20 lg:pt-[98px]">
      <div className="life-ambient" aria-hidden="true">
        <span className="life-ambient-dot left-[14%] top-[22%]" />
        <span className="life-ambient-dot left-[78%] top-[18%]" />
        <span className="life-ambient-dot left-[64%] top-[72%]" />
        <span className="life-ambient-dot left-[24%] top-[78%]" />
      </div>
      <div className="life-hero-bg-aurora" aria-hidden="true" />
      <div className="life-hero-bg-contours" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] gap-8 py-0 lg:gap-10">
        <div className="mx-auto max-w-[920px] text-center">
          <p className="mb-7 inline-flex max-w-full rounded-full border border-[var(--life-border)] bg-[var(--life-surface-2)] px-4 py-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--life-accent)] shadow-[var(--life-shadow-card)] sm:text-xs">
            AI money + task cockpit
          </p>
          <h1 className="mx-auto max-w-[900px] text-[clamp(2.15rem,4.25vw,4.55rem)] font-semibold leading-[1.14] tracking-normal text-[var(--life-text)]">
            Plan the day by money, energy, and real priorities.
          </h1>
          <p className="mx-auto mt-7 max-w-[62ch] text-[clamp(0.98rem,1.25vw,1.14rem)] leading-8 text-[var(--life-muted)]">
            Life Pilot AI blends spending drift, upcoming tasks, routines, and
            focus blocks into one colorful daily operating system.
          </p>
          <div className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-3">
            {["Cashflow aware", "Task load mapped", "AI review ready"].map(
              (item) => (
                <span
                  className="rounded-full border border-[var(--life-border)] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-sm font-semibold text-[var(--life-muted)] shadow-[var(--life-shadow-card)] backdrop-blur-xl"
                  key={item}
                >
                  {item}
                </span>
              ),
            )}
          </div>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryLink href="/register">
              Create account
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={2}
              />
            </PrimaryLink>
            <GhostLink href="/dashboard">
              <Zap aria-hidden="true" className="size-4" strokeWidth={2} />
              Open dashboard
            </GhostLink>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm text-[var(--life-dim)]">
            {proofPoints.map((item) => (
              <span className="inline-flex items-center gap-2" key={item}>
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 text-[var(--life-accent)]"
                  strokeWidth={2}
                />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
