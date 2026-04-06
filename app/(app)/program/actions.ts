"use server";

import { revalidatePath } from "next/cache";
import {
  workoutProgramDayDraftSchema,
  workoutProgramDraftSchema,
} from "@/lib/schema/workout";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveProgramResult =
  | { success: true }
  | { success: false; error: string };

export async function saveWorkoutProgramAction(
  input: unknown,
): Promise<SaveProgramResult> {
  const parsed = workoutProgramDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "프로그램 입력값을 확인하세요.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  if (parsed.data.is_active) {
    await supabase
      .from("workout_programs")
      .update({ is_active: false })
      .eq("user_id", user.id);
  }

  const { error } = await supabase.from("workout_programs").insert({
    user_id: user.id,
    name: parsed.data.name,
    description: parsed.data.description,
    focus: parsed.data.focus,
    cycle_mode: parsed.data.cycle_mode,
    is_active: parsed.data.is_active,
  });

  if (error) {
    return { success: false, error: "프로그램 저장에 실패했습니다." };
  }

  revalidatePath("/program");
  revalidatePath("/training");
  revalidatePath("/today");

  return { success: true };
}

export async function saveWorkoutProgramDayAction(
  input: unknown,
): Promise<SaveProgramResult> {
  const parsed = workoutProgramDayDraftSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "program day 입력값을 확인하세요.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const { data: program } = await supabase
    .from("workout_programs")
    .select("id")
    .eq("id", parsed.data.program_id)
    .eq("user_id", user.id)
    .single();

  if (!program) {
    return { success: false, error: "프로그램을 찾을 수 없습니다." };
  }

  const { error } = await supabase.from("workout_program_days").insert({
    program_id: parsed.data.program_id,
    day_order: parsed.data.day_order,
    name: parsed.data.name,
    focus: parsed.data.focus,
    notes: parsed.data.notes,
  });

  if (error) {
    return { success: false, error: "program day 저장에 실패했습니다." };
  }

  revalidatePath("/program");
  revalidatePath("/training");

  return { success: true };
}
