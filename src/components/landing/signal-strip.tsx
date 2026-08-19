import { signalCards } from "./landing-data";

export function SignalStrip() {
  return (
    <div className="relative z-10 border-y border-[var(--life-border)] bg-[var(--life-surface)]">
      <div className="mx-auto grid max-w-[1200px] gap-3 px-4 py-7 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {signalCards.map((card) => (
          <div
            className="life-signal-card rounded-2xl border border-[var(--life-border)] bg-[var(--life-surface-2)] p-5 shadow-[var(--life-shadow-card)]"
            key={card.label}
          >
            <p className="text-sm text-[var(--life-muted)]">{card.label}</p>
            <p
              className={`mt-3 inline-flex rounded-full px-3 py-1.5 font-mono text-xl font-bold ${card.tone}`}
            >
              {card.value}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[var(--life-dim)]">
              {card.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
