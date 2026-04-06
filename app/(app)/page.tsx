import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { buildDashboardSnapshot } from "@/lib/domain/dashboard/build-dashboard-snapshot";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date();
  const todayDate = today.toISOString().slice(0, 10);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);

  const [
    { data: profile },
    { data: todayMeals },
    { data: weekCardioLogs },
    { data: recentBodyMetrics },
    { data: todayCheckin },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("meals").select("*").eq("user_id", user.id).eq("meal_date", todayDate),
    supabase
      .from("cardio_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("performed_at", weekStart.toISOString())
      .lte("performed_at", today.toISOString()),
    supabase
      .from("body_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_on", { ascending: false })
      .limit(7),
    supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", todayDate)
      .maybeSingle(),
  ]);

  const snapshot = buildDashboardSnapshot({
    today,
    profile: profile ?? null,
    todayMeals: todayMeals ?? [],
    weekCardioLogs: weekCardioLogs ?? [],
    recentBodyMetrics: recentBodyMetrics ?? [],
    todayCheckin: todayCheckin ?? null,
  });

  return <DashboardShell snapshot={snapshot} />;
}
