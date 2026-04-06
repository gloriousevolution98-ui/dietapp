import { saveProfileAction } from "@/app/(app)/settings/actions";
import { ProfileSettingsScreen } from "@/components/settings/profile-settings-screen";
import type { ProfileDraft } from "@/lib/schema/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const initialValue: ProfileDraft = {
    display_name: profile?.display_name ?? undefined,
    height_cm: profile?.height_cm ?? undefined,
    current_weight_kg: profile?.current_weight_kg ?? undefined,
    goal_weight_kg: profile?.goal_weight_kg ?? undefined,
    protein_target_g: profile?.protein_target_g ?? 170,
    main_cardio: profile?.main_cardio ?? "stairmaster",
    primary_split: profile?.primary_split ?? "back/chest/shoulder/arms_legs",
    default_lunch_rice_g_min: profile?.default_lunch_rice_g_min ?? 150,
    default_lunch_rice_g_max: profile?.default_lunch_rice_g_max ?? 210,
    default_dinner_rice_g_min: profile?.default_dinner_rice_g_min ?? 100,
    default_dinner_rice_g_max: profile?.default_dinner_rice_g_max ?? 150,
    one_appointment_rice_g_min: profile?.one_appointment_rice_g_min ?? 50,
    one_appointment_rice_g_max: profile?.one_appointment_rice_g_max ?? 100,
    two_appointment_home_rice_g_min:
      profile?.two_appointment_home_rice_g_min ?? 0,
    two_appointment_home_rice_g_max:
      profile?.two_appointment_home_rice_g_max ?? 50,
  };

  return (
    <ProfileSettingsScreen
      initialValue={initialValue}
      saveProfile={saveProfileAction}
    />
  );
}
