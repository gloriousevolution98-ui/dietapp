"use server";

import { revalidatePath } from "next/cache";
import { cardioLogDraftSchema } from "@/lib/schema/logs";
import { AUTH_DISABLED_MESSAGE } from "@/lib/auth/mode";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveCardioLogResult =
  | { success: true }
  | { success: false; error: string };

export async function saveCardioLogAction(
  input: unknown,
): Promise<SaveCardioLogResult> {
  const parsed = cardioLogDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "유산소 입력값을 확인하세요.",
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

  const { error } = await supabase.from("cardio_logs").insert({
    user_id: user.id,
    performed_at: parsed.data.performed_at,
    duration_min: parsed.data.duration_min,
    level: parsed.data.level,
    calories_kcal: parsed.data.calories_kcal,
    intensity: parsed.data.intensity,
    notes: parsed.data.notes,
  });

  if (error) {
    return {
      success: false,
      error: "유산소 저장에 실패했습니다.",
    };
  }

  revalidatePath("/cardio");
  revalidatePath("/");

  return { success: true };
}
