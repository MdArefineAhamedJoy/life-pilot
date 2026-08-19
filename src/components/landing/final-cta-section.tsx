import { ArrowRight, Clock3 } from "lucide-react";

import { Eyebrow, GhostLink, PrimaryLink } from "./landing-primitives";

export function FinalCtaSection() {
  return (
    <section className="px-4 pb-[clamp(24px,3vw,44px)] pt-0 sm:px-6">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[22px] border border-[var(--life-border-strong)] bg-[radial-gradient(700px_300px_at_50%_0%,var(--life-accent-soft),transparent_70%),var(--life-surface)] px-5 py-[clamp(30px,4vw,48px)] text-center shadow-[var(--life-shadow)]">
        <div
          className="absolute left-1/2 top-[-260px] size-[460px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--life-accent-glow),transparent_65%)] opacity-50 blur-lg"
          aria-hidden="true"
        />
        <div className="relative">
          <Eyebrow center>Get started</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-[var(--life-text)]">
            Build a personal AI workspace around your real life.
          </h2>
          <p className="mx-auto mb-8 mt-5 max-w-[58ch] text-base leading-7 text-[var(--life-muted)]">
            Login and registration pages are ready for the prototype, and the
            working app is available at the dashboard route.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryLink href="/register">
              Register now
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={2}
              />
            </PrimaryLink>
            <GhostLink href="/login">
              <Clock3 aria-hidden="true" className="size-4" strokeWidth={2} />
              Login
            </GhostLink>
          </div>
        </div>
      </div>
    </section>
  );
}
