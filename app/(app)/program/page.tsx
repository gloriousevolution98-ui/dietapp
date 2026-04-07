import {
  saveWorkoutProgramAction,
  saveWorkoutProgramDayAction,
} from "@/app/(app)/program/actions";
import { ProgramScreen } from "@/components/program/program-screen";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProgramPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: programs } = user
    ? await supabase
        .from("workout_programs")
        .select("*")
        .eq("user_id", user.id)
        .order("is_active", { ascending: false })
        .order("created_at", { ascending: false })
    : { data: [] };

  const activeProgram = (programs ?? []).find((program) => program.is_active) ?? null;
  const { data: days } = activeProgram && user
    ? await supabase
        .from("workout_program_days")
        .select("*")
        .eq("program_id", activeProgram.id)
        .order("day_order", { ascending: true })
    : { data: [] };

  return (
    <ProgramScreen
      programs={programs ?? []}
      activeProgram={activeProgram}
      days={days ?? []}
      saveProgram={saveWorkoutProgramAction}
      saveProgramDay={saveWorkoutProgramDayAction}
    />
  );
}
