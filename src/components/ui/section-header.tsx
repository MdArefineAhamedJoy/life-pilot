type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="min-w-0 max-w-3xl">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-normal text-emerald-600">{eyebrow}</p>}
      <h1 className="mt-2 break-words text-2xl font-semibold text-slate-800 sm:text-3xl lg:text-4xl">{title}</h1>
      {description && <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>}
    </div>
  );
}
