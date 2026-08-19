import { CheckCircle2 } from "lucide-react";

import { dashboardRows } from "./landing-data";
import { Eyebrow } from "./landing-primitives";

export function DashboardSection() {
  return (
    <section
      className="px-4 py-[clamp(72px,10vw,128px)] sm:px-6"
      id="dashboard"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 max-w-[700px]">
          <Eyebrow>Command center</Eyebrow>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-tight text-[var(--life-text)]">
            One screen. Total personal clarity.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[var(--life-muted)]">
            Budget, habits, reminders, and goals show up together so decisions
            happen faster.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-[var(--life-border-strong)] bg-[var(--life-surface)] shadow-[var(--life-shadow)]">
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--life-border)] bg-[var(--life-surface-2)] px-5 py-4">
            <span className="life-tdot bg-[#ff5f57]" />
            <span className="life-tdot bg-[#febc2e]" />
            <span className="life-tdot bg-[#28c840]" />
            <span className="ml-2 text-sm font-semibold text-[var(--life-text)]">
              Dashboard preview
            </span>
            <span className="life-chip ml-auto">
              <span className="life-live-dot size-2 rounded-full bg-[var(--life-accent)]" />
              Live signals
            </span>
          </div>
          <div className="grid min-h-[420px] lg:grid-cols-[1.5fr_1fr]">
            <div className="border-[var(--life-border)] p-5 lg:border-r">
              <div className="relative h-[300px] overflow-hidden rounded-2xl border border-[var(--life-border)] bg-[radial-gradient(circle_at_60%_30%,var(--life-accent-softer),transparent_55%),var(--life-surface-2)]">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 520 300"
                >
                  <path
                    className="life-map-roads"
                    d="M0 80 H520 M0 180 H520 M120 0 V300 M300 0 V300 M430 0 V300"
                  />
                  <path
                    className="life-map-route"
                    d="M45 238 C 140 202, 188 112, 310 96 S 430 122, 480 54"
                  />
                </svg>
                <div className="absolute left-[16%] top-[66%] rounded-2xl border border-[var(--life-glass-border)] bg-[color-mix(in_srgb,var(--life-surface)_70%,transparent)] p-4 shadow-[var(--life-shadow-card)] backdrop-blur-xl">
                  <p className="font-mono text-2xl font-bold text-[var(--life-text)]">
                    14
                  </p>
                  <p className="text-xs uppercase tracking-[0.1em] text-[var(--life-dim)]">
                    Focus sessions
                  </p>
                </div>
                <div className="absolute right-5 top-5 rounded-2xl border border-[var(--life-glass-border)] bg-[color-mix(in_srgb,var(--life-surface)_70%,transparent)] p-4 shadow-[var(--life-shadow-card)] backdrop-blur-xl">
                  <p className="font-mono text-2xl font-bold text-[var(--life-text)]">
                    BDT 18.2k
                  </p>
                  <p className="text-xs uppercase tracking-[0.1em] text-[var(--life-dim)]">
                    Spend this month
                  </p>
                </div>
              </div>
            </div>
            <aside className="bg-[var(--life-surface-2)] p-5">
              <h3 className="text-base font-semibold text-[var(--life-text)]">
                Activity feed
              </h3>
              <p className="mb-5 mt-1 text-sm text-[var(--life-dim)]">
                Auto-grouped by priority
              </p>
              <div>
                {dashboardRows.map((item) => (
                  <div
                    className="flex gap-3 border-b border-[var(--life-border)] py-3 last:border-b-0"
                    key={item.title}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--life-accent-soft)] text-[var(--life-accent)]">
                      <CheckCircle2
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={2}
                      />
                    </span>
                    <span>
                      <b className="block text-sm font-semibold text-[var(--life-text)]">
                        {item.title}
                      </b>
                      <small className="text-xs text-[var(--life-muted)]">
                        {item.detail}
                      </small>
                    </span>
                    <span className="ml-auto whitespace-nowrap font-mono text-xs text-[var(--life-dim)]">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
