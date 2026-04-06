import type { LoggedMeal } from "@/lib/domain/meals/types";

type MealCardProps = {
  meal: LoggedMeal;
};

export function MealCard({ meal }: MealCardProps) {
  return (
    <section className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              {meal.mealTypeLabel}
            </h2>
            <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
              {meal.contextLabel}
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">{meal.eatenAtLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tracking-[-0.04em]">
            {Math.round(meal.totals.kcal)} kcal
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            P {Math.round(meal.totals.protein)} / C {Math.round(meal.totals.carbs)} /
            F {Math.round(meal.totals.fat)}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {meal.entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-[20px] bg-[var(--surface-strong)] px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {entry.name}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {entry.quantity}
                {entry.unit}
              </p>
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {Math.round(entry.kcal)} kcal · P {Math.round(entry.protein)} / C{" "}
              {Math.round(entry.carbs)} / F {Math.round(entry.fat)}
            </p>
          </div>
        ))}
      </div>
      {meal.note ? (
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{meal.note}</p>
      ) : null}
    </section>
  );
}
