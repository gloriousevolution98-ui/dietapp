import type { DashboardSnapshot } from "@/lib/domain/dashboard/types";

type WeeklyCardioCardProps = {
  cardio: DashboardSnapshot["weeklyCardio"];
};

export function WeeklyCardioCard({ cardio }: WeeklyCardioCardProps) {
  return (
    <section className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
        Stairmaster
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[var(--foreground)]">
        {cardio.sessions}
        <span className="ml-1 text-base text-[var(--muted)]">sessions</span>
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        이번 주 총 {cardio.totalMinutes}분
      </p>
      <div className="mt-4 flex gap-2">
        {cardio.week.map((done, index) => (
          <span
            key={index}
            className={`h-2 flex-1 rounded-full ${
              done ? "bg-[var(--success)]" : "bg-[rgba(120,103,85,0.12)]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
