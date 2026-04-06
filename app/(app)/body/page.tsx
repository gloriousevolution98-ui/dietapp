import { saveBodyMetricAction } from "@/app/(app)/body/actions";
import { BodyMetricsScreen } from "@/components/body/body-metrics-screen";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function BodyPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: metrics } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", user.id)
    .order("recorded_on", { ascending: false })
    .limit(10);

  return (
    <BodyMetricsScreen
      initialMetrics={metrics ?? []}
      saveMetric={saveBodyMetricAction}
    />
  );
}
