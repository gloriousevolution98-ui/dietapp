import type { DashboardSnapshot } from "@/lib/domain/dashboard/types";

type TodayRoutineCardProps = {
  routine: DashboardSnapshot["todayRoutine"];
};

export function TodayRoutineCard({ routine }: TodayRoutineCardProps) {
  return (
    <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Today Routine
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
            {routine.name}
          </h2>
        </div>
        <span className="rounded-full bg-[rgba(47,107,82,0.12)] px-3 py-1 text-xs font-medium text-[var(--success)]">
          {routine.progress}
        </span>
      </div>
      {routine.isPlaceholder ? (
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          program / strength logs 미연결
        </p>
      ) : null}
      <div className="mt-5 space-y-3">
        {routine.items.map((item) => (
          <div
            key={item.name}
            className="rounded-[22px] bg-[var(--surface-strong)] px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {item.name}
              </p>
              {item.emphasis ? (
                <span className="rounded-full bg-[rgba(159,90,47,0.12)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                  {item.emphasis}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{item.target}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
