import { saveDailyCheckinAction } from "@/app/(app)/today/actions";
import { CheckinForm } from "@/components/today/checkin-form";
import type { DailyCheckinDraft } from "@/lib/schema/logs";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TodayPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: todayCheckin } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  const initialValue: DailyCheckinDraft = {
    date: today,
    appointments_count: todayCheckin?.appointments_count ?? 0,
    trained_today: todayCheckin?.trained_today ?? false,
    planned_program_day_id: todayCheckin?.planned_program_day_id ?? undefined,
    sleep_hours: todayCheckin?.sleep_hours ?? undefined,
    steps: todayCheckin?.steps ?? undefined,
    stress_score: todayCheckin?.stress_score ?? undefined,
    hunger_score: todayCheckin?.hunger_score ?? undefined,
    digestive_score: todayCheckin?.digestive_score ?? undefined,
    prev_day_overeat: todayCheckin?.prev_day_overeat ?? false,
    lower_body_fatigue_score: todayCheckin?.lower_body_fatigue_score ?? undefined,
    notes: todayCheckin?.notes ?? undefined,
  };

  return (
    <CheckinForm
      initialValue={initialValue}
      saveCheckin={saveDailyCheckinAction}
    />
  );
}
