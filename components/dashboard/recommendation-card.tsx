import type { DashboardSnapshot } from "@/lib/domain/dashboard/types";

type RecommendationCardProps = {
  recommendation: DashboardSnapshot["recommendation"];
};

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  return (
    <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(71,55,38,0.08)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Today Recommendation
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
            {recommendation.title}
          </h2>
        </div>
        <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">
          {recommendation.badge}
        </span>
      </div>
      {recommendation.isPlaceholder ? (
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          아직 rule-based recommendation 미연결
        </p>
      ) : null}
      <div className="mt-5 grid gap-3">
        {recommendation.lines.map((line) => (
          <div
            key={line.label}
            className="flex items-center justify-between rounded-[22px] bg-[var(--surface-strong)] px-4 py-3"
          >
            <span className="text-sm text-[var(--muted)]">{line.label}</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {line.value}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        {recommendation.note}
      </p>
    </section>
  );
}
