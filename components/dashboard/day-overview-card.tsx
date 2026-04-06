import type { DashboardSnapshot } from "@/lib/domain/dashboard/types";

type DayOverviewCardProps = {
  snapshot: DashboardSnapshot;
};

export function DayOverviewCard({ snapshot }: DayOverviewCardProps) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-[rgba(86,64,45,0.12)] bg-[linear-gradient(145deg,rgba(125,69,31,0.98),rgba(87,48,20,0.96))] p-5 text-white shadow-[0_24px_60px_rgba(78,48,23,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[rgba(255,232,209,0.78)]">
            {snapshot.dateLabel}
          </p>
          <h1 className="mt-3 text-[2rem] font-semibold leading-none tracking-[-0.06em]">
            {snapshot.dayTypeLabel}
          </h1>
          <p className="mt-3 max-w-[14rem] text-sm leading-6 text-[rgba(255,241,228,0.84)]">
            {snapshot.focusCopy}
          </p>
        </div>
        <div className="rounded-[24px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-3 py-2 text-right backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[rgba(255,232,209,0.74)]">
            Program
          </p>
          <p className="mt-1 text-base font-semibold">{snapshot.programDay}</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {snapshot.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[24px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] px-3 py-3 backdrop-blur"
          >
            <p className="text-[10px] uppercase tracking-[0.24em] text-[rgba(255,232,209,0.72)]">
              {stat.label}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.04em]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
