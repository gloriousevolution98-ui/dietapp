type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="space-y-3 pt-2">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <div className="space-y-2">
        <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">
          {title}
        </h1>
        <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>
      </div>
    </header>
  );
}
