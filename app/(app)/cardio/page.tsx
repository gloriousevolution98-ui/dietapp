import { saveCardioLogAction } from "@/app/(app)/cardio/actions";
import { CardioLogScreen } from "@/components/cardio/cardio-log-screen";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CardioPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);

  const [{ data: logs }, { data: weeklyLogs }] = user
    ? await Promise.all([
        supabase
          .from("cardio_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("performed_at", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("cardio_logs")
          .select("*")
          .eq("user_id", user.id)
          .gte("performed_at", weekStart.toISOString())
          .lte("performed_at", today.toISOString()),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <CardioLogScreen
      initialLogs={logs ?? []}
      weeklySessions={(weeklyLogs ?? []).length}
      weeklyMinutes={(weeklyLogs ?? []).reduce(
        (sum, log) => sum + log.duration_min,
        0,
      )}
      saveCardio={saveCardioLogAction}
    />
  );
}
