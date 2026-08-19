import { BellRing, CheckCircle2 } from "lucide-react";

import { dashboardRows } from "./landing-data";

export function PriorityFeedPanel() {
  return (
    <aside className="relative z-10 border-t border-[var(--life-border)] bg-[color-mix(in_srgb,var(--life-surface-2)_76%,transparent)] p-5 backdrop-blur-xl lg:border-l lg:border-t-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--life-text)]">
            Priority feed
          </p>
          <p className="text-xs text-[var(--life-dim)]">
            Auto-organized from today
          </p>
        </div>
        <span className="life-chip">
          <BellRing aria-hidden="true" className="size-4" strokeWidth={2} />
          12
        </span>
      </div>
      <div className="space-y-3">
        {dashboardRows.map((row) => (
          <div
            className="flex gap-3 border-b border-[var(--life-border)] pb-3 last:border-b-0 last:pb-0"
            key={row.title}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--life-accent-soft)] text-[var(--life-accent)]">
              <CheckCircle2
                aria-hidden="true"
                className="size-4"
                strokeWidth={2}
              />
            </span>
            <span className="min-w-0">
              <b className="block truncate text-sm font-semibold text-[var(--life-text)]">
                {row.title}
              </b>
              <small className="block truncate text-xs text-[var(--life-muted)]">
                {row.detail}
              </small>
            </span>
            <span className="ml-auto font-mono text-xs text-[var(--life-dim)]">
              {row.time}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
