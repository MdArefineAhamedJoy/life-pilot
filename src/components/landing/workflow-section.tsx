import { workflow } from "./landing-data";
import { Eyebrow } from "./landing-primitives";

export function WorkflowSection() {
  return (
    <section className="px-4 py-[clamp(72px,10vw,128px)] sm:px-6" id="workflow">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <Eyebrow center>How it works</Eyebrow>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-tight text-[var(--life-text)]">
            From daily noise to command in four steps.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {workflow.map((step, index) => (
            <article
              className="relative rounded-[18px] border border-[var(--life-border)] bg-[var(--life-surface)] p-6 shadow-[var(--life-shadow-card)]"
              key={step.title}
            >
              <div className="grid size-10 place-items-center rounded-full border border-[var(--life-accent-line)] bg-[var(--life-accent-soft)] font-mono text-sm font-bold text-[var(--life-accent)]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[var(--life-text)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--life-muted)]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
