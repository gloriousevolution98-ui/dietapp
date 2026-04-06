import { z } from "zod";
import type { TableInsert, TableRow, TableUpdate } from "@/lib/types/database";
import { isoDateTimeSchema, nullableNumberField, optionalTextField, uuidSchema } from "@/lib/schema/shared";

export const profileSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  display_name: z.string().nullable(),
  height_cm: z.number().nullable(),
  current_weight_kg: z.number().nullable(),
  goal_weight_kg: z.number().nullable(),
  protein_target_g: z.number().int(),
  main_cardio: z.string().nullable(),
  primary_split: z.string().nullable(),
  default_lunch_rice_g_min: z.number().int(),
  default_lunch_rice_g_max: z.number().int(),
  default_dinner_rice_g_min: z.number().int(),
  default_dinner_rice_g_max: z.number().int(),
  one_appointment_rice_g_min: z.number().int(),
  one_appointment_rice_g_max: z.number().int(),
  two_appointment_home_rice_g_min: z.number().int(),
  two_appointment_home_rice_g_max: z.number().int(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"profiles">>;

export const profileInsertSchema = z.object({
  user_id: uuidSchema,
  display_name: optionalTextField,
  height_cm: nullableNumberField,
  current_weight_kg: nullableNumberField,
  goal_weight_kg: nullableNumberField,
  protein_target_g: z.coerce.number().int().min(0).default(170),
  main_cardio: optionalTextField,
  primary_split: optionalTextField,
  default_lunch_rice_g_min: z.coerce.number().int().min(0).default(150),
  default_lunch_rice_g_max: z.coerce.number().int().min(0).default(210),
  default_dinner_rice_g_min: z.coerce.number().int().min(0).default(100),
  default_dinner_rice_g_max: z.coerce.number().int().min(0).default(150),
  one_appointment_rice_g_min: z.coerce.number().int().min(0).default(50),
  one_appointment_rice_g_max: z.coerce.number().int().min(0).default(100),
  two_appointment_home_rice_g_min: z.coerce.number().int().min(0).default(0),
  two_appointment_home_rice_g_max: z.coerce.number().int().min(0).default(50),
}) satisfies z.ZodType<Omit<TableInsert<"profiles">, "id" | "created_at" | "updated_at">>;

export const profileUpdateSchema =
  profileInsertSchema.partial() satisfies z.ZodType<TableUpdate<"profiles">>;

export const profileDraftSchema = z.object({
  display_name: optionalTextField,
  height_cm: nullableNumberField,
  current_weight_kg: nullableNumberField,
  goal_weight_kg: nullableNumberField,
  protein_target_g: z.coerce.number().int().min(0).default(170),
  main_cardio: optionalTextField,
  primary_split: optionalTextField,
  default_lunch_rice_g_min: z.coerce.number().int().min(0).default(150),
  default_lunch_rice_g_max: z.coerce.number().int().min(0).default(210),
  default_dinner_rice_g_min: z.coerce.number().int().min(0).default(100),
  default_dinner_rice_g_max: z.coerce.number().int().min(0).default(150),
  one_appointment_rice_g_min: z.coerce.number().int().min(0).default(50),
  one_appointment_rice_g_max: z.coerce.number().int().min(0).default(100),
  two_appointment_home_rice_g_min: z.coerce.number().int().min(0).default(0),
  two_appointment_home_rice_g_max: z.coerce.number().int().min(0).default(50),
});

export type Profile = z.infer<typeof profileSchema>;
export type ProfileInsert = z.infer<typeof profileInsertSchema>;
export type ProfileDraft = z.infer<typeof profileDraftSchema>;
