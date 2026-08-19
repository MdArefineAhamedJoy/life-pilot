import { features } from "./landing-data";
import { Eyebrow } from "./landing-primitives";

export function FeaturesSection() {
  return (
    <section className="px-4 py-[clamp(72px,10vw,128px)] sm:px-6" id="features">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 max-w-[720px]">
          <Eyebrow>The platform</Eyebrow>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-[var(--life-text)]">
            Everything personal planning needs, unified.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[var(--life-muted)]">
            One workspace replaces scattered notes, budget checks, routine
            trackers, and reminder lists.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {features.map(({ title, description, icon: Icon }, index) => (
            <article
              className={`life-feature-card group relative overflow-hidden rounded-[18px] border border-[var(--life-border)] bg-[var(--life-surface)] p-6 shadow-[var(--life-shadow-card)] transition hover:-translate-y-1 hover:border-[var(--life-accent-line)] ${
                index === 0
                  ? "life-feature-card-large md:col-span-2 lg:col-span-3 lg:row-span-2 lg:min-h-[420px]"
                  : index === 3
                    ? "md:col-span-2 lg:col-span-6 lg:grid lg:grid-cols-[0.55fr_1fr] lg:items-center"
                    : "lg:col-span-3"
              }`}
              key={title}
            >
              <div>
                <div className="mb-5 grid size-12 place-items-center rounded-[14px] border border-[var(--life-accent-line)] bg-[var(--life-accent-soft)] text-[var(--life-accent)]">
                  <Icon
                    aria-hidden="true"
                    className="size-6"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-xl font-semibold text-[var(--life-text)]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--life-muted)]">
                  {description}
                </p>
              </div>
              {index === 0 ? (
                <div className="mt-10 grid gap-3">
                  {["Money drift", "Task pressure", "Focus window"].map(
                    (item) => (
                      <div
                        className="flex items-center justify-between rounded-2xl border border-[var(--life-border)] bg-[color-mix(in_srgb,var(--life-surface-2)_70%,transparent)] px-4 py-3"
                        key={item}
                      >
                        <span className="text-sm font-medium text-[var(--life-muted)]">
                          {item}
                        </span>
                        <span className="h-2 w-24 overflow-hidden rounded-full bg-[var(--life-border)]">
                          <span className="block h-full w-2/3 rounded-full bg-[var(--life-accent)]" />
                        </span>
                      </div>
                    ),
                  )}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
