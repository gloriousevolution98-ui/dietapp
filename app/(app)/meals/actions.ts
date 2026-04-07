"use server";

import { revalidatePath } from "next/cache";
import { AUTH_DISABLED_MESSAGE } from "@/lib/auth/mode";
import {
  buildLoggedMealFromDraft,
  calculateMealTotals,
} from "@/lib/domain/meals/calculate-meal-totals";
import { mealDraftSchema } from "@/lib/schema/meal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LoggedMeal } from "@/lib/domain/meals/types";

export type SaveMealResult =
  | {
      success: true;
      meal: LoggedMeal;
    }
  | {
      success: false;
      error: string;
    };

export async function saveMealAction(input: unknown): Promise<SaveMealResult> {
  const parsed = mealDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "식사 입력값을 확인하세요.",
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

  const totals = calculateMealTotals(
    parsed.data.entries.map((entry) => ({
      kcal: entry.kcal,
      carbs: entry.carbs_g,
      protein: entry.protein_g,
      fat: entry.fat_g,
    })),
  );

  const { data: mealRow, error: mealError } = await supabase
    .from("meals")
    .insert({
      user_id: user.id,
      meal_date: parsed.data.meal_date,
      eaten_at: parsed.data.eaten_at,
      meal_type: parsed.data.meal_type,
      context_type: parsed.data.context_type,
      note: parsed.data.note,
      imported_legacy: false,
      total_kcal: totals.kcal,
      total_carbs_g: totals.carbs,
      total_protein_g: totals.protein,
      total_fat_g: totals.fat,
    })
    .select("*")
    .single();

  if (mealError || !mealRow) {
    return {
      success: false,
      error: "식사 저장에 실패했습니다.",
    };
  }

  const { error: entriesError } = await supabase.from("meal_entries").insert(
    parsed.data.entries.map((entry) => ({
      meal_id: mealRow.id,
      food_item_id: entry.food_item_id,
      custom_food_name: entry.custom_food_name,
      quantity: entry.quantity,
      unit: entry.unit,
      kcal: entry.kcal,
      carbs_g: entry.carbs_g,
      protein_g: entry.protein_g,
      fat_g: entry.fat_g,
      is_estimated: entry.is_estimated,
      memo: entry.memo,
    })),
  );

  if (entriesError) {
    await supabase.from("meals").delete().eq("id", mealRow.id);

    return {
      success: false,
      error: "식사 항목 저장에 실패했습니다.",
    };
  }

  revalidatePath("/meals");

  return {
    success: true,
    meal: buildLoggedMealFromDraft({
      id: mealRow.id,
      draft: parsed.data,
    }),
  };
}
