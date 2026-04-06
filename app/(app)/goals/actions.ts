"use server";

import { revalidatePath } from "next/cache";
import { goalPlanDraftSchema } from "@/lib/schema/goal-plan";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveGoalResult =
  | { success: true }
  | { success: false; error: string };

export async function saveGoalPlanAction(
  input: unknown,
): Promise<SaveGoalResult> {
  const parsed = goalPlanDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "목표 입력값을 확인하세요.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  if (parsed.data.is_active) {
    await supabase
      .from("goal_plans")
      .update({ is_active: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase.from("goal_plans").insert({
    user_id: user.id,
    name: parsed.data.name,
    goal_type: parsed.data.goal_type,
    start_date: parsed.data.start_date,
    end_date: parsed.data.end_date,
    target_weight_kg: parsed.data.target_weight_kg,
    activity_level: parsed.data.activity_level,
    constitution_type: parsed.data.constitution_type,
    training_focus: parsed.data.training_focus,
    protein_target_g: parsed.data.protein_target_g,
    is_active: parsed.data.is_active,
    notes: parsed.data.notes,
  });

  if (error) {
    return { success: false, error: "목표 저장에 실패했습니다." };
  }

  revalidatePath("/goals");

  return { success: true };
}
