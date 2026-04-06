type WeightPoint = {
  day: string;
  weight: number;
};

type WeightTrendCardProps = {
  points: WeightPoint[];
};

export function WeightTrendCard({ points }: WeightTrendCardProps) {
  if (points.length === 0 || points.every((point) => point.weight === 0)) {
    return (
      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          7-Day Weight
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
          최근 7일 체중 추세
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          아직 body_metrics 데이터가 없습니다.
        </p>
      </section>
    );
  }

  const maxWeight = Math.max(...points.map((point) => point.weight));
  const minWeight = Math.min(...points.map((point) => point.weight));
  const range = Math.max(0.1, maxWeight - minWeight);

  return (
    <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            7-Day Weight
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
            최근 7일 체중 추세
          </h2>
        </div>
        <p className="text-sm text-[var(--muted)]">
          {points[0]?.weight.toFixed(1)}kg to{" "}
          {points.at(-1)?.weight.toFixed(1)}kg
        </p>
      </div>
      <div className="mt-5 flex h-36 items-end gap-2">
        {points.map((point) => {
          const normalized = ((point.weight - minWeight) / range) * 100;

          return (
            <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-28 w-full items-end rounded-[20px] bg-[rgba(120,103,85,0.08)] px-1.5 pb-1.5">
                <div
                  className="w-full rounded-[16px] bg-[linear-gradient(180deg,rgba(226,175,123,0.95),rgba(157,90,47,0.95))]"
                  style={{ height: `${Math.max(18, normalized + 18)}%` }}
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                  {point.day}
                </p>
                <p className="mt-1 text-xs font-semibold text-[var(--foreground)]">
                  {point.weight.toFixed(1)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
