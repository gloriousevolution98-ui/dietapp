import { z } from "zod";
import {
  exerciseScopes,
  exerciseTypes,
  measurementModes,
} from "@/lib/types/enums";
import type { TableInsert, TableRow, TableUpdate } from "@/lib/types/database";
import {
  isoDateTimeSchema,
  nullableNumberField,
  optionalTextField,
  uuidSchema,
} from "@/lib/schema/shared";

export const exerciseItemSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  name: z.string(),
  exercise_type: z.enum(exerciseTypes),
  exercise_scope: z.enum(exerciseScopes),
  body_part: z.string().nullable(),
  equipment: z.string().nullable(),
  measurement_mode: z.enum(measurementModes),
  is_free_weight: z.boolean(),
  default_rep_min: z.number().int().nullable(),
  default_rep_max: z.number().int().nullable(),
  default_rir: z.number().int().nullable(),
  progression_step_kg: z.number().nullable(),
  is_active: z.boolean(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"exercise_items">>;

export const exerciseItemInsertSchema = z.object({
  user_id: uuidSchema,
  name: z.string().min(1),
  exercise_type: z.enum(exerciseTypes),
  exercise_scope: z.enum(exerciseScopes).default("specific"),
  body_part: optionalTextField,
  equipment: optionalTextField,
  measurement_mode: z.enum(measurementModes),
  is_free_weight: z.boolean().default(false),
  default_rep_min: z.coerce.number().int().min(0).optional(),
  default_rep_max: z.coerce.number().int().min(0).optional(),
  default_rir: z.coerce.number().int().min(0).optional(),
  progression_step_kg: nullableNumberField,
  is_active: z.boolean().default(true),
  notes: optionalTextField,
}) satisfies z.ZodType<Omit<TableInsert<"exercise_items">, "id" | "created_at" | "updated_at">>;

export const exerciseItemUpdateSchema =
  exerciseItemInsertSchema.partial() satisfies z.ZodType<
    TableUpdate<"exercise_items">
  >;

export const exerciseItemDraftSchema = z.object({
  name: z.string().trim().min(1),
  exercise_type: z.enum(exerciseTypes),
  exercise_scope: z.enum(exerciseScopes).default("specific"),
  body_part: optionalTextField,
  equipment: optionalTextField,
  measurement_mode: z.enum(measurementModes),
  is_free_weight: z.boolean().default(false),
  default_rep_min: z.coerce.number().int().min(0).optional(),
  default_rep_max: z.coerce.number().int().min(0).optional(),
  default_rir: z.coerce.number().int().min(0).optional(),
  progression_step_kg: nullableNumberField,
  is_active: z.boolean().default(true),
  notes: optionalTextField,
});

export type ExerciseItemDraft = z.infer<typeof exerciseItemDraftSchema>;
