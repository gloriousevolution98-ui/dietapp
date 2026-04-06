type MealSummaryCardProps = {
  mealsCount: number;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};

export function MealSummaryCard({
  mealsCount,
  totalKcal,
  totalProtein,
  totalCarbs,
  totalFat,
}: MealSummaryCardProps) {
  return (
    <section className="rounded-[30px] border border-[var(--line)] bg-[linear-gradient(145deg,rgba(255,253,248,0.9),rgba(245,238,228,0.92))] p-5 shadow-[0_16px_40px_rgba(71,55,38,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
        Today Summary
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[22px] bg-[rgba(255,255,255,0.6)] px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Meals
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
            {mealsCount}
          </p>
        </div>
        <div className="rounded-[22px] bg-[rgba(255,255,255,0.6)] px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Kcal
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
            {Math.round(totalKcal)}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="rounded-[22px] bg-[var(--surface)] px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Protein
          </p>
          <p className="mt-2 text-lg font-semibold">{Math.round(totalProtein)}g</p>
        </div>
        <div className="rounded-[22px] bg-[var(--surface)] px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Carbs
          </p>
          <p className="mt-2 text-lg font-semibold">{Math.round(totalCarbs)}g</p>
        </div>
        <div className="rounded-[22px] bg-[var(--surface)] px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Fat
          </p>
          <p className="mt-2 text-lg font-semibold">{Math.round(totalFat)}g</p>
        </div>
      </div>
    </section>
  );
}
