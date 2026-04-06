import {
  saveFoodItemAction,
  toggleFoodFavoriteAction,
} from "@/app/(app)/library/foods/actions";
import { FoodLibraryScreen } from "@/components/foods/food-library-screen";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function FoodLibraryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: foods } = await supabase
    .from("food_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("is_favorite", { ascending: false })
    .order("name", { ascending: true });

  return (
    <FoodLibraryScreen
      foods={foods ?? []}
      saveFood={saveFoodItemAction}
      toggleFavorite={toggleFoodFavoriteAction}
    />
  );
}
