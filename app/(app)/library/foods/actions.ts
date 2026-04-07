"use server";

import { revalidatePath } from "next/cache";
import { AUTH_DISABLED_MESSAGE } from "@/lib/auth/mode";
import { foodItemDraftSchema } from "@/lib/schema/food";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveFoodItemResult =
  | { success: true }
  | { success: false; error: string };

export async function saveFoodItemAction(
  input: unknown,
): Promise<SaveFoodItemResult> {
  const parsed = foodItemDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "음식 입력값을 확인하세요.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: AUTH_DISABLED_MESSAGE,
    };
  }

  const { error } = await supabase.from("food_items").insert({
    user_id: user.id,
    name: parsed.data.name,
    food_group: parsed.data.food_group,
    base_quantity: parsed.data.base_quantity,
    base_unit: parsed.data.base_unit,
    kcal: parsed.data.kcal,
    carbs_g: parsed.data.carbs_g,
    protein_g: parsed.data.protein_g,
    fat_g: parsed.data.fat_g,
    macro_status: parsed.data.macro_status,
    is_macro_estimated: parsed.data.is_macro_estimated,
    is_favorite: parsed.data.is_favorite,
    is_active: true,
    source: "manual",
    notes: parsed.data.notes,
  });

  if (error) {
    return {
      success: false,
      error: "Food 저장에 실패했습니다.",
    };
  }

  revalidatePath("/library/foods");
  revalidatePath("/meals");

  return { success: true };
}

export async function toggleFoodFavoriteAction(input: {
  id: string;
  isFavorite: boolean;
}): Promise<SaveFoodItemResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: AUTH_DISABLED_MESSAGE,
    };
  }

  const { error } = await supabase
    .from("food_items")
    .update({ is_favorite: !input.isFavorite })
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      error: "즐겨찾기 변경에 실패했습니다.",
    };
  }

  revalidatePath("/library/foods");
  revalidatePath("/meals");

  return { success: true };
}
