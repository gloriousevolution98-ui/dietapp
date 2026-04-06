type ProteinProgressCardProps = {
  consumed: number;
  target: number;
};

export function ProteinProgressCard({
  consumed,
  target,
}: ProteinProgressCardProps) {
  const progress = Math.min(100, Math.round((consumed / target) * 100));

  return (
    <section className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
        Protein
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
        {consumed}
        <span className="ml-1 text-base text-[var(--muted)]">/ {target}g</span>
      </p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[rgba(120,103,85,0.12)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#b86a35,#e0a26c)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
        오늘 목표의 {progress}%를 채웠습니다.
      </p>
    </section>
  );
}
