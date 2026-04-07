"use server";

import { revalidatePath } from "next/cache";
import { bodyMetricDraftSchema } from "@/lib/schema/logs";
import { AUTH_DISABLED_MESSAGE } from "@/lib/auth/mode";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveBodyMetricResult =
  | { success: true }
  | { success: false; error: string };

export async function saveBodyMetricAction(
  input: unknown,
): Promise<SaveBodyMetricResult> {
  const parsed = bodyMetricDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "바디 지표 입력값을 확인하세요.",
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

  const { error } = await supabase.from("body_metrics").insert({
    user_id: user.id,
    recorded_on: parsed.data.recorded_on,
    weight_kg: parsed.data.weight_kg,
    waist_cm: parsed.data.waist_cm,
    body_fat_pct: parsed.data.body_fat_pct,
    skeletal_muscle_kg: parsed.data.skeletal_muscle_kg,
    fat_mass_kg: parsed.data.fat_mass_kg,
    visceral_fat_level: parsed.data.visceral_fat_level,
    inbody_score: parsed.data.inbody_score,
    source: "manual",
    notes: parsed.data.notes,
  });

  if (error) {
    return {
      success: false,
      error: "바디 지표 저장에 실패했습니다.",
    };
  }

  revalidatePath("/body");
  revalidatePath("/");

  return { success: true };
}
