import { saveGoalPlanAction } from "@/app/(app)/goals/actions";
import { GoalsScreen } from "@/components/goals/goals-screen";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function GoalsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: goals } = await supabase
    .from("goal_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("is_active", { ascending: false })
    .order("start_date", { ascending: false });

  return <GoalsScreen goals={goals ?? []} saveGoal={saveGoalPlanAction} />;
}
