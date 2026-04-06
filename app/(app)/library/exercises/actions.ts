"use server";

import { revalidatePath } from "next/cache";
import { exerciseItemDraftSchema } from "@/lib/schema/exercise";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveExerciseItemResult =
  | { success: true }
  | { success: false; error: string };

export async function saveExerciseItemAction(
  input: unknown,
): Promise<SaveExerciseItemResult> {
  const parsed = exerciseItemDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "운동 입력값을 확인하세요.",
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
      error: "로그인이 필요합니다.",
    };
  }

  const { error } = await supabase.from("exercise_items").insert({
    user_id: user.id,
    name: parsed.data.name,
    exercise_type: parsed.data.exercise_type,
    exercise_scope: parsed.data.exercise_scope,
    body_part: parsed.data.body_part,
    equipment: parsed.data.equipment,
    measurement_mode: parsed.data.measurement_mode,
    is_free_weight: parsed.data.is_free_weight,
    default_rep_min: parsed.data.default_rep_min,
    default_rep_max: parsed.data.default_rep_max,
    default_rir: parsed.data.default_rir,
    progression_step_kg: parsed.data.progression_step_kg,
    is_active: parsed.data.is_active,
    notes: parsed.data.notes,
  });

  if (error) {
    return {
      success: false,
      error: "Exercise 저장에 실패했습니다.",
    };
  }

  revalidatePath("/library/exercises");
  revalidatePath("/training");

  return { success: true };
}

export async function toggleExerciseActiveAction(input: {
  id: string;
  isActive: boolean;
}): Promise<SaveExerciseItemResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "로그인이 필요합니다.",
    };
  }

  const { error } = await supabase
    .from("exercise_items")
    .update({ is_active: !input.isActive })
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      error: "활성 상태 변경에 실패했습니다.",
    };
  }

  revalidatePath("/library/exercises");
  revalidatePath("/training");

  return { success: true };
}
