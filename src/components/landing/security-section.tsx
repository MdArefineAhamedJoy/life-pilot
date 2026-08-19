import { securityItems } from "./landing-data";
import { Eyebrow } from "./landing-primitives";

export function SecuritySection() {
  return (
    <section className="px-4 py-[clamp(72px,10vw,128px)] sm:px-6" id="security">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Eyebrow>Trust and control</Eyebrow>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-tight text-[var(--life-text)]">
            AI suggestions stay visible, editable, and under your control.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {securityItems.map(({ title, detail, icon: Icon }) => (
            <article
              className="rounded-[18px] border border-[var(--life-border)] bg-[var(--life-surface)] p-6 shadow-[var(--life-shadow-card)]"
              key={title}
            >
              <Icon
                aria-hidden="true"
                className="size-7 text-[var(--life-accent)]"
                strokeWidth={2}
              />
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
