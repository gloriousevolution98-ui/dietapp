"use server";

import { revalidatePath } from "next/cache";
import { AUTH_DISABLED_MESSAGE } from "@/lib/auth/mode";
import { profileDraftSchema } from "@/lib/schema/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveProfileResult =
  | { success: true }
  | { success: false; error: string };

export async function saveProfileAction(
  input: unknown,
): Promise<SaveProfileResult> {
  const parsed = profileDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "프로필 입력값을 확인하세요.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: AUTH_DISABLED_MESSAGE };
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      display_name: parsed.data.display_name,
      height_cm: parsed.data.height_cm,
      current_weight_kg: parsed.data.current_weight_kg,
      goal_weight_kg: parsed.data.goal_weight_kg,
      protein_target_g: parsed.data.protein_target_g,
      main_cardio: parsed.data.main_cardio,
      primary_split: parsed.data.primary_split,
      default_lunch_rice_g_min: parsed.data.default_lunch_rice_g_min,
      default_lunch_rice_g_max: parsed.data.default_lunch_rice_g_max,
      default_dinner_rice_g_min: parsed.data.default_dinner_rice_g_min,
      default_dinner_rice_g_max: parsed.data.default_dinner_rice_g_max,
      one_appointment_rice_g_min: parsed.data.one_appointment_rice_g_min,
      one_appointment_rice_g_max: parsed.data.one_appointment_rice_g_max,
      two_appointment_home_rice_g_min:
        parsed.data.two_appointment_home_rice_g_min,
      two_appointment_home_rice_g_max:
        parsed.data.two_appointment_home_rice_g_max,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return { success: false, error: "프로필 저장에 실패했습니다." };
  }

  revalidatePath("/settings");
  revalidatePath("/");

  return { success: true };
}
