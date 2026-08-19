import { Bot } from "lucide-react";

import { prompts } from "./landing-data";
import { Eyebrow } from "./landing-primitives";

export function AiPromptSection() {
  return (
    <section className="life-section-cyan border-y border-[var(--life-border)] bg-[var(--life-surface)] px-4 py-[clamp(72px,10vw,128px)] sm:px-6">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-[var(--life-border-strong)] bg-[var(--life-surface-2)] p-6 shadow-[var(--life-shadow)]">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-[var(--life-accent)] text-white">
              <Bot aria-hidden="true" className="size-6" strokeWidth={2} />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--life-accent)]">
                Ask Life Pilot AI
              </p>
              <h2 className="text-2xl font-semibold text-[var(--life-text)]">
                Natural language planning prompts.
              </h2>
            </div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {prompts.map((prompt) => (
              <div
                className="rounded-2xl border border-[var(--life-border)] bg-[var(--life-surface)] p-4 text-sm font-medium leading-6 text-[var(--life-muted)]"
                key={prompt}
              >
                {prompt}
              </div>
            ))}
          </div>
        </div>

        <div className="grid content-center gap-5">
          <Eyebrow>AI layer</Eyebrow>
          <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-tight text-[var(--life-text)]">
            The assistant reads context, then gives focused answers.
          </h2>
          <p className="text-base leading-7 text-[var(--life-muted)]">
            Reviewable suggestions keep the product practical: budget signals,
            routine tradeoffs, focus timing, and small next steps.
          </p>
        </div>
      </div>
    </section>
  );
}
