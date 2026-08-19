import type { CSSProperties } from "react";

export function HeroCockpitSection() {
  return (
    <section className="relative px-4 pb-10 pt-0 sm:px-6 lg:pb-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="life-hero-visual relative min-h-[430px] overflow-hidden rounded-[32px] border border-[var(--life-border-strong)] bg-[var(--life-surface)] p-5 shadow-[var(--life-shadow)]">
          <div
            className="life-spectrum-plate absolute inset-0"
            aria-hidden="true"
          />
          <div className="relative z-10 grid h-full gap-4 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-between gap-4">
              <div className="rounded-[24px] border border-[var(--life-border)] bg-[color-mix(in_srgb,var(--life-surface-2)_78%,transparent)] p-5 backdrop-blur-xl">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--life-dim)]">
                  Today signal
                </p>
                <p className="mt-5 text-5xl font-semibold text-[var(--life-text)]">
                  82
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--life-muted)]">
                  Budget is healthy, but Friday tasks need protection.
                </p>
              </div>

              <div className="grid gap-3">
                {["Money", "Tasks", "Focus"].map((item, index) => (
                  <div
                    className="life-hero-meter rounded-2xl border border-[var(--life-border)] bg-[color-mix(in_srgb,var(--life-surface)_72%,transparent)] p-3"
                    key={item}
                    style={{ "--meter-index": index } as CSSProperties}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[var(--life-dim)]">
                      <span>{item}</span>
                      <span>
                        {index === 0
                          ? "safe"
                          : index === 1
                            ? "heavy"
                            : "open"}
                      </span>
                    </div>
                    <span className="mt-3 block h-2 overflow-hidden rounded-full bg-[var(--life-border)]">
                      <span className="life-hero-meter-fill block h-full rounded-full" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-[var(--life-border)] bg-[color-mix(in_srgb,var(--life-surface-2)_76%,transparent)] p-5 backdrop-blur-xl">
              <div className="life-orbit-ring absolute left-1/2 top-1/2 size-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
              <div className="life-orbit-ring life-orbit-ring-sm absolute left-1/2 top-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between gap-3">
                  <span className="life-chip">Live plan</span>
                  <span className="rounded-full bg-[var(--life-secondary)] px-3 py-1 font-mono text-xs font-bold text-[#26150f]">
                    +3 moves
                  </span>
                </div>

                <div className="grid gap-3">
                  {[
                    ["Groceries", "Move to Friday", "life-hero-pill-a"],
                    ["Study block", "Protect 2h", "life-hero-pill-b"],
                    ["Bill review", "Before 6pm", "life-hero-pill-c"],
                  ].map(([title, detail, className]) => (
                    <div
                      className={`${className} rounded-2xl border border-[var(--life-border)] p-4 shadow-[var(--life-shadow-card)]`}
                      key={title}
                    >
                      <p className="text-sm font-semibold text-[var(--life-text)]">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--life-muted)]">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-[var(--life-border)] bg-[rgba(255,255,255,0.06)] p-4">
                  <p className="text-sm font-semibold text-[var(--life-text)]">
                    AI recommendation
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--life-muted)]">
                    Save BDT 2,400 buffer and shift low-energy errands out of
                    deep work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
