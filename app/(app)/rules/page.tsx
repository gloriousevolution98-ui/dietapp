import { RulesScreen } from "@/components/rules/rules-screen";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RulesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: rules } = await supabase
    .from("recommendation_rules")
    .select("*")
    .eq("user_id", user.id)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false });

  return <RulesScreen rules={rules ?? []} />;
}
