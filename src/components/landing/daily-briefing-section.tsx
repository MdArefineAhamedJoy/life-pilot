import { MessageSquareText } from "lucide-react";

import { signalCards } from "./landing-data";
import { Eyebrow } from "./landing-primitives";
import { PriorityFeedPanel } from "./priority-feed-panel";

export function DailyBriefingSection() {
  return (
    <section className="relative px-4 pb-10 pt-6 sm:px-6 lg:pb-12 lg:pt-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-7 grid gap-5 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <Eyebrow>Daily briefing</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.85rem,3vw,2.75rem)] font-semibold leading-tight text-[var(--life-text)]">
              A living map of money pressure, task load, and protected focus.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[var(--life-muted)] lg:justify-self-end">
            Designed like an operating console: high-signal cards first,
            contextual feed second, and AI suggestions only when they clarify
            the next move.
          </p>
        </div>

        <div className="life-stage relative min-w-0 overflow-hidden rounded-[28px] border border-[var(--life-border-strong)] bg-[radial-gradient(circle_at_70%_18%,var(--life-accent-softer),transparent_34%),var(--life-surface)] shadow-[var(--life-shadow)]">
          <div className="flex items-center gap-2 border-b border-[var(--life-border)] bg-[var(--life-surface-2)] px-4 py-3 backdrop-blur-xl">
            <span className="life-tdot bg-[#ff5f57]" />
            <span className="life-tdot bg-[#febc2e]" />
            <span className="life-tdot bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs tracking-[0.08em] text-[var(--life-dim)]">
              life-pilot.ai / daily-briefing
            </span>
            <span className="life-chip ml-auto">
              <span className="life-live-dot size-2 rounded-full bg-[var(--life-accent)]" />
              Live
            </span>
          </div>

          <div className="relative grid min-h-[440px] overflow-hidden lg:grid-cols-[1.4fr_0.9fr]">
            <svg
              aria-hidden="true"
              className="absolute inset-0 size-full opacity-70"
              preserveAspectRatio="none"
              viewBox="0 0 980 430"
            >
              <path
                className="life-map-roads"
                d="M0 90 H980 M0 210 H980 M0 340 H980 M160 0 V430 M380 0 V430 M620 0 V430 M820 0 V430"
              />
              <path
                className="life-map-route"
                d="M72 342 C 180 292, 240 160, 414 154 S 720 220, 880 88"
              />
              <path
                className="life-map-route life-map-route-alt"
                d="M80 122 C 250 180, 360 92, 560 224 S 790 330, 930 250"
              />
            </svg>

            <div className="relative z-10 p-5 sm:p-7">
              <div className="grid gap-3 sm:grid-cols-3">
                {signalCards.slice(0, 3).map((card) => (
                  <div
                    className="rounded-2xl border border-[var(--life-border)] bg-[color-mix(in_srgb,var(--life-surface-2)_70%,transparent)] p-4 backdrop-blur-xl"
                    key={card.label}
                  >
                    <p className="text-xs uppercase tracking-[0.1em] text-[var(--life-dim)]">
                      {card.label}
                    </p>
                    <p className="mt-3 font-mono text-3xl font-bold text-[var(--life-text)]">
                      {card.value}
                    </p>
                    <p className="mt-1 text-xs text-[var(--life-muted)]">
                      {card.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="life-float mt-5 max-w-xl rounded-2xl border border-[var(--life-glass-border)] bg-[color-mix(in_srgb,var(--life-surface-2)_68%,transparent)] p-5 shadow-[var(--life-shadow-card)] backdrop-blur-2xl">
                <div className="flex gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--life-accent-soft)] text-[var(--life-accent)]">
                    <MessageSquareText
                      aria-hidden="true"
                      className="size-5"
                      strokeWidth={2}
                    />
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--life-text)]">
                      AI suggestion
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--life-muted)]">
                      Move grocery shopping to Friday evening, batch meal prep
                      on Saturday, and protect one quiet study block before
                      calls.
                    </p>
                    <div className="mt-4 h-1.5 rounded-full bg-[var(--life-border)]">
                      <div className="life-progress h-full rounded-full bg-[var(--life-accent)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PriorityFeedPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
