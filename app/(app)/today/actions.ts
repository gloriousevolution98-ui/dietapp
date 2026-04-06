"use server";

import { revalidatePath } from "next/cache";
import { dailyCheckinDraftSchema } from "@/lib/schema/logs";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveDailyCheckinResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function saveDailyCheckinAction(
  input: unknown,
): Promise<SaveDailyCheckinResult> {
  const parsed = dailyCheckinDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "체크인 입력값을 확인하세요.",
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

  const { error } = await supabase.from("daily_checkins").upsert(
    {
      user_id: user.id,
      date: parsed.data.date,
      appointments_count: parsed.data.appointments_count,
      trained_today: parsed.data.trained_today,
      planned_program_day_id: parsed.data.planned_program_day_id,
      sleep_hours: parsed.data.sleep_hours,
      steps: parsed.data.steps,
      stress_score: parsed.data.stress_score,
      hunger_score: parsed.data.hunger_score,
      digestive_score: parsed.data.digestive_score,
      prev_day_overeat: parsed.data.prev_day_overeat,
      lower_body_fatigue_score: parsed.data.lower_body_fatigue_score,
      notes: parsed.data.notes,
    },
    { onConflict: "user_id,date" },
  );

  if (error) {
    return {
      success: false,
      error: "오늘 체크인 저장에 실패했습니다.",
    };
  }

  revalidatePath("/");
  revalidatePath("/today");

  return { success: true };
}
