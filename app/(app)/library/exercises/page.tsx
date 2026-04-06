import {
  saveExerciseItemAction,
  toggleExerciseActiveAction,
} from "@/app/(app)/library/exercises/actions";
import { ExerciseLibraryScreen } from "@/components/exercises/exercise-library-screen";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ExerciseLibraryPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: exercises } = await supabase
    .from("exercise_items")
    .select("*")
    .eq("user_id", user.id)
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });

  return (
    <ExerciseLibraryScreen
      exercises={exercises ?? []}
      saveExercise={saveExerciseItemAction}
      toggleActive={toggleExerciseActiveAction}
    />
  );
}
