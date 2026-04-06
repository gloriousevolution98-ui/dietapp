import type { LoggedMeal } from "@/lib/domain/meals/types";
import type { MealDraft } from "@/lib/schema/meal";

const mealTypeLabels: Record<MealDraft["meal_type"], string> = {
  breakfast: "아침",
  lunch: "점심",
  snack: "간식",
  dinner: "저녁",
  late_night: "야식",
};

const contextLabels: Record<MealDraft["context_type"], string> = {
  default: "기본",
  training: "운동일",
  one_appointment: "1회 약속",
  two_appointments: "2회 약속",
  recovery: "회복",
};

export function calculateMealTotals(
  entries: Array<{
    kcal: number;
    carbs: number;
    protein: number;
    fat: number;
  }>,
) {
  return entries.reduce(
    (totals, entry) => ({
      kcal: totals.kcal + entry.kcal,
      carbs: totals.carbs + entry.carbs,
      protein: totals.protein + entry.protein,
      fat: totals.fat + entry.fat,
    }),
    { kcal: 0, carbs: 0, protein: 0, fat: 0 },
  );
}

export function calculateDailyMealTotals(meals: LoggedMeal[]) {
  return meals.reduce(
    (totals, meal) => ({
      mealsCount: totals.mealsCount + 1,
      kcal: totals.kcal + meal.totals.kcal,
      carbs: totals.carbs + meal.totals.carbs,
      protein: totals.protein + meal.totals.protein,
      fat: totals.fat + meal.totals.fat,
    }),
    { mealsCount: 0, kcal: 0, carbs: 0, protein: 0, fat: 0 },
  );
}

export function buildLoggedMealFromDraft({
  id,
  draft,
}: {
  id: string;
  draft: MealDraft;
}): LoggedMeal {
  const entries = draft.entries.map((entry) => ({
    id: crypto.randomUUID(),
    name: entry.custom_food_name ?? "Custom food",
    quantity: entry.quantity,
    unit: entry.unit,
    kcal: entry.kcal,
    carbs: entry.carbs_g,
    protein: entry.protein_g,
    fat: entry.fat_g,
  }));
  const totals = calculateMealTotals(entries);
  const eatenAt = draft.eaten_at ? new Date(draft.eaten_at) : null;
  const eatenAtLabel = eatenAt
    ? `${String(eatenAt.getHours()).padStart(2, "0")}:${String(
        eatenAt.getMinutes(),
      ).padStart(2, "0")}`
    : "시간 미입력";

  return {
    id,
    mealType: draft.meal_type,
    mealTypeLabel: mealTypeLabels[draft.meal_type],
    contextType: draft.context_type,
    contextLabel: contextLabels[draft.context_type],
    eatenAtLabel,
    note: draft.note,
    totals,
    entries,
  };
}
