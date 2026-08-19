import { modules } from "./landing-data";
import { Eyebrow } from "./landing-primitives";

export function ModulesSection() {
  return (
    <section
      className="life-section-dark border-y border-[var(--life-border)] bg-[var(--life-surface)] px-4 py-[clamp(72px,10vw,128px)] sm:px-6"
      id="modules"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <Eyebrow>Connected modules</Eyebrow>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-tight text-[var(--life-text)]">
            Every life area feeds one planning brain.
          </h2>
          <p className="mt-5 text-base leading-7 text-[var(--life-muted)]">
            The landing page connects into the working Life Pilot app, including
            budget, routine, timer, notes, goals, reports, and more.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map(({ title, detail, icon: Icon }) => (
            <article
              className="rounded-[18px] border border-[var(--life-border)] bg-[var(--life-surface-2)] p-5 shadow-[var(--life-shadow-card)]"
              key={title}
            >
              <span className="grid size-11 place-items-center rounded-[14px] bg-[var(--life-accent-soft)] text-[var(--life-accent)]">
                <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[var(--life-text)]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--life-muted)]">
                {detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
