import { z } from "zod";
import type { TableInsert, TableRow, TableUpdate } from "@/lib/types/database";
import {
  isoDateSchema,
  isoDateTimeSchema,
  optionalTextField,
  uuidSchema,
} from "@/lib/schema/shared";
import { sessionTypes } from "@/lib/types/enums";

export const workoutProgramSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  name: z.string(),
  description: z.string().nullable(),
  focus: z.string().nullable(),
  cycle_mode: z.string().nullable(),
  is_active: z.boolean(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"workout_programs">>;

export const workoutProgramInsertSchema = z.object({
  user_id: uuidSchema,
  name: z.string().min(1),
  description: optionalTextField,
  focus: optionalTextField,
  cycle_mode: optionalTextField.default("rolling"),
  is_active: z.boolean().default(true),
}) satisfies z.ZodType<
  Omit<TableInsert<"workout_programs">, "id" | "created_at" | "updated_at">
>;

export const workoutProgramDaySchema = z.object({
  id: uuidSchema,
  program_id: uuidSchema,
  day_order: z.number().int(),
  name: z.string(),
  focus: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"workout_program_days">>;

export const workoutProgramDayExerciseSchema = z.object({
  id: uuidSchema,
  program_day_id: uuidSchema,
  exercise_item_id: uuidSchema,
  sort_order: z.number().int(),
  target_sets: z.number().int(),
  rep_min: z.number().int().nullable(),
  rep_max: z.number().int().nullable(),
  target_rir: z.number().int().nullable(),
  rest_seconds: z.number().int().nullable(),
  progression_method: z.string().nullable(),
  progression_step_kg: z.number().nullable(),
  is_priority: z.boolean(),
  is_corrective_required_before: z.boolean(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"workout_program_day_exercises">>;

export const workoutSessionSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  session_date: isoDateSchema,
  program_day_id: uuidSchema.nullable(),
  session_type: z.enum(sessionTypes),
  readiness_score: z.number().int().nullable(),
  completed: z.boolean(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"workout_sessions">>;

export const workoutSessionInsertSchema = z.object({
  user_id: uuidSchema,
  session_date: isoDateSchema,
  program_day_id: uuidSchema.optional(),
  session_type: z.enum(sessionTypes).default("strength"),
  readiness_score: z.coerce.number().int().min(0).max(10).optional(),
  completed: z.boolean().default(false),
  notes: optionalTextField,
}) satisfies z.ZodType<
  Omit<TableInsert<"workout_sessions">, "id" | "created_at" | "updated_at">
>;

export const workoutSessionUpdateSchema =
  workoutSessionInsertSchema.partial() satisfies z.ZodType<
    TableUpdate<"workout_sessions">
  >;

export const workoutProgramDraftSchema = z.object({
  name: z.string().trim().min(1),
  description: optionalTextField,
  focus: optionalTextField,
  cycle_mode: optionalTextField.default("rolling"),
  is_active: z.boolean().default(true),
});

export const workoutProgramDayDraftSchema = z.object({
  program_id: uuidSchema,
  day_order: z.coerce.number().int().min(1),
  name: z.string().trim().min(1),
  focus: optionalTextField,
  notes: optionalTextField,
});

export type WorkoutProgramDraft = z.infer<typeof workoutProgramDraftSchema>;
export type WorkoutProgramDayDraft = z.infer<typeof workoutProgramDayDraftSchema>;
