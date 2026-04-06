import type { TableRow } from "@/lib/types/database";
import { buildLoggedMealFromDraft } from "@/lib/domain/meals/calculate-meal-totals";
import type { FavoriteFood, LoggedMeal } from "@/lib/domain/meals/types";
import type { MealDraft } from "@/lib/schema/meal";

type MealRow = TableRow<"meals">;
type MealEntryRow = TableRow<"meal_entries">;
type FoodItemRow = TableRow<"food_items">;

export function mapMealsToLoggedMeals(
  meals: MealRow[],
  entries: MealEntryRow[],
): LoggedMeal[] {
  const entriesByMealId = new Map<string, MealEntryRow[]>();

  for (const entry of entries) {
    const current = entriesByMealId.get(entry.meal_id) ?? [];
    current.push(entry);
    entriesByMealId.set(entry.meal_id, current);
  }

  return meals.map((meal) => {
    const draft = {
      meal_date: meal.meal_date,
      eaten_at: meal.eaten_at ?? undefined,
      meal_type: meal.meal_type,
      context_type: meal.context_type,
      note: meal.note ?? undefined,
      imported_legacy: meal.imported_legacy,
      entries: (entriesByMealId.get(meal.id) ?? []).map((entry) => ({
        food_item_id: entry.food_item_id ?? undefined,
        custom_food_name: entry.custom_food_name ?? undefined,
        quantity: entry.quantity,
        unit: entry.unit,
        kcal: entry.kcal,
        carbs_g: entry.carbs_g,
        protein_g: entry.protein_g,
        fat_g: entry.fat_g,
        is_estimated: entry.is_estimated,
        memo: entry.memo ?? undefined,
      })),
    } satisfies MealDraft;

    return buildLoggedMealFromDraft({
      id: meal.id,
      draft,
    });
  });
}

export function mapFoodsToFavorites(foodItems: FoodItemRow[]): FavoriteFood[] {
  return foodItems.map((food) => ({
    name: food.name,
    quantity: food.base_quantity,
    unit: food.base_unit,
    kcal: food.kcal ?? 0,
    carbs: food.carbs_g ?? 0,
    protein: food.protein_g ?? 0,
    fat: food.fat_g ?? 0,
  }));
}
