import Link from "next/link";
import { saveMealAction } from "@/app/(app)/meals/actions";
import { MealLogScreen } from "@/components/meals/meal-log-screen";
import { mapFoodsToFavorites, mapMealsToLoggedMeals } from "@/lib/domain/meals/serializers";
import { favoriteFoods as fallbackFavoriteFoods } from "@/lib/mocks/meals";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function MealsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ data: mealsData }, { data: favoriteFoodRows }] = await Promise.all([
    supabase
      .from("meals")
      .select("*")
      .eq("user_id", user.id)
      .order("eaten_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("food_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_favorite", true)
      .eq("is_active", true)
      .order("name", { ascending: true })
      .limit(8),
  ]);

  const mealIds = (mealsData ?? []).map((meal) => meal.id);
  const { data: mealEntriesData } = mealIds.length
    ? await supabase
        .from("meal_entries")
        .select("*")
        .in("meal_id", mealIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const meals = mapMealsToLoggedMeals(mealsData ?? [], mealEntriesData ?? []);
  const favoriteFoods =
    favoriteFoodRows && favoriteFoodRows.length > 0
      ? mapFoodsToFavorites(favoriteFoodRows)
      : fallbackFavoriteFoods;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/library/foods"
          className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)]"
        >
          Food Master
        </Link>
      </div>
      <MealLogScreen
        initialMeals={meals}
        favoriteFoods={favoriteFoods}
        saveMeal={saveMealAction}
      />
    </div>
  );
}
