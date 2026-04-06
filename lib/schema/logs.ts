import { z } from "zod";
import {
  bodyMetricSources,
  cardioIntensities,
  loggedModes,
  recommendationTypes,
} from "@/lib/types/enums";
import type { TableInsert, TableRow } from "@/lib/types/database";
import {
  isoDateSchema,
  isoDateTimeSchema,
  jsonValueSchema,
  nullableNumberField,
  optionalTextField,
  uuidSchema,
} from "@/lib/schema/shared";

export const strengthExerciseLogSchema = z.object({
  id: uuidSchema,
  workout_session_id: uuidSchema,
  exercise_item_id: uuidSchema,
  body_part: z.string().nullable(),
  logged_mode: z.enum(loggedModes),
  weight_kg: z.number().nullable(),
  reps: z.number().int().nullable(),
  sets_count: z.number().int().nullable(),
  target_rir: z.number().int().nullable(),
  total_volume_kg: z.number().nullable(),
  is_pr: z.boolean(),
  memo: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"strength_exercise_logs">>;

export const strengthSetLogSchema = z.object({
  id: uuidSchema,
  strength_exercise_log_id: uuidSchema,
  set_order: z.number().int(),
  weight_kg: z.number().nullable(),
  reps: z.number().int().nullable(),
  rir: z.number().int().nullable(),
  is_top_set: z.boolean(),
  is_backoff: z.boolean(),
  completed: z.boolean(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"strength_set_logs">>;

export const cardioLogSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  workout_session_id: uuidSchema.nullable(),
  exercise_item_id: uuidSchema.nullable(),
  performed_at: isoDateTimeSchema.nullable(),
  duration_min: z.number().int(),
  level: z.number().int().nullable(),
  distance_km: z.number().nullable(),
  calories_kcal: z.number().nullable(),
  avg_hr: z.number().int().nullable(),
  intensity: z.enum(cardioIntensities).nullable(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"cardio_logs">>;

export const cardioLogInsertSchema = z.object({
  user_id: uuidSchema,
  workout_session_id: uuidSchema.optional(),
  exercise_item_id: uuidSchema.optional(),
  performed_at: isoDateTimeSchema.optional(),
  duration_min: z.coerce.number().int().positive(),
  level: z.coerce.number().int().min(0).optional(),
  distance_km: nullableNumberField,
  calories_kcal: nullableNumberField,
  avg_hr: z.coerce.number().int().min(0).optional(),
  intensity: z.enum(cardioIntensities).optional(),
  notes: optionalTextField,
}) satisfies z.ZodType<
  Omit<TableInsert<"cardio_logs">, "id" | "created_at" | "updated_at">
>;

export const cardioLogDraftSchema = z.object({
  performed_at: isoDateTimeSchema.optional(),
  duration_min: z.coerce.number().int().positive(),
  level: z.coerce.number().int().min(0).optional(),
  calories_kcal: nullableNumberField,
  intensity: z.enum(cardioIntensities).optional(),
  notes: optionalTextField,
});

export type CardioLogDraft = z.infer<typeof cardioLogDraftSchema>;

export const bodyMetricSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  recorded_on: isoDateSchema,
  weight_kg: z.number().nullable(),
  waist_cm: z.number().nullable(),
  body_fat_pct: z.number().nullable(),
  skeletal_muscle_kg: z.number().nullable(),
  fat_mass_kg: z.number().nullable(),
  visceral_fat_level: z.number().int().nullable(),
  inbody_score: z.number().int().nullable(),
  source: z.union([z.enum(bodyMetricSources), z.string()]).nullable(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"body_metrics">>;

export const bodyMetricDraftSchema = z.object({
  recorded_on: isoDateSchema,
  weight_kg: nullableNumberField,
  waist_cm: nullableNumberField,
  body_fat_pct: nullableNumberField,
  skeletal_muscle_kg: nullableNumberField,
  fat_mass_kg: nullableNumberField,
  visceral_fat_level: z.coerce.number().int().min(0).optional(),
  inbody_score: z.coerce.number().int().min(0).optional(),
  notes: optionalTextField,
});

export type BodyMetricDraft = z.infer<typeof bodyMetricDraftSchema>;

export const dailyCheckinSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  date: isoDateSchema,
  appointments_count: z.number().int(),
  trained_today: z.boolean(),
  planned_program_day_id: uuidSchema.nullable(),
  sleep_hours: z.number().nullable(),
  steps: z.number().int().nullable(),
  stress_score: z.number().int().nullable(),
  hunger_score: z.number().int().nullable(),
  digestive_score: z.number().int().nullable(),
  prev_day_overeat: z.boolean(),
  lower_body_fatigue_score: z.number().int().nullable(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"daily_checkins">>;

export const dailyCheckinDraftSchema = z.object({
  date: isoDateSchema,
  appointments_count: z.coerce.number().int().min(0).max(2).default(0),
  trained_today: z.boolean().default(false),
  planned_program_day_id: uuidSchema.optional(),
  sleep_hours: nullableNumberField,
  steps: z.coerce.number().int().min(0).optional(),
  stress_score: z.coerce.number().int().min(1).max(5).optional(),
  hunger_score: z.coerce.number().int().min(1).max(5).optional(),
  digestive_score: z.coerce.number().int().min(1).max(5).optional(),
  prev_day_overeat: z.boolean().default(false),
  lower_body_fatigue_score: z.coerce.number().int().min(1).max(5).optional(),
  notes: optionalTextField,
}) satisfies z.ZodType<
  Omit<TableInsert<"daily_checkins">, "id" | "user_id" | "created_at" | "updated_at">
>;

export type DailyCheckinDraft = z.infer<typeof dailyCheckinDraftSchema>;

export const correctiveRoutineLogSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  date: isoDateSchema,
  routine_name: z.string(),
  item_name: z.string(),
  completed: z.boolean(),
  duration_min: z.number().int().nullable(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"corrective_routine_logs">>;

export const generatedRecommendationSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  date: isoDateSchema,
  recommendation_type: z.enum(recommendationTypes),
  title: z.string(),
  body: z.string(),
  context_json: jsonValueSchema,
  actions_json: jsonValueSchema,
  source_rule_id: uuidSchema.nullable(),
  acknowledged_at: isoDateTimeSchema.nullable(),
  created_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"generated_recommendations">>;

export const recommendationRuleSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  name: z.string(),
  rule_type: z.enum(recommendationTypes),
  priority: z.number().int(),
  conditions_json: jsonValueSchema,
  actions_json: jsonValueSchema,
  active: z.boolean(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"recommendation_rules">>;

export const recommendationRuleInsertSchema = z.object({
  user_id: uuidSchema,
  name: z.string().min(1),
  rule_type: z.enum(recommendationTypes),
  priority: z.coerce.number().int().min(0).default(100),
  conditions_json: jsonValueSchema.default({}),
  actions_json: jsonValueSchema.default({}),
  active: z.boolean().default(true),
  notes: optionalTextField,
}) satisfies z.ZodType<
  Omit<
    TableInsert<"recommendation_rules">,
    "id" | "created_at" | "updated_at"
  >
>;
