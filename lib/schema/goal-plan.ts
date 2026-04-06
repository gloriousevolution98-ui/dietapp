import { z } from "zod";
import { goalTypes } from "@/lib/types/enums";
import type { TableInsert, TableRow, TableUpdate } from "@/lib/types/database";
import {
  isoDateSchema,
  isoDateTimeSchema,
  nullableNumberField,
  optionalTextField,
  uuidSchema,
} from "@/lib/schema/shared";

export const goalPlanSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  name: z.string(),
  goal_type: z.enum(goalTypes),
  start_date: isoDateSchema,
  end_date: isoDateSchema.nullable(),
  target_weight_kg: z.number().nullable(),
  activity_level: z.string().nullable(),
  constitution_type: z.string().nullable(),
  training_focus: z.string().nullable(),
  protein_target_g: z.number().int().nullable(),
  is_active: z.boolean(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"goal_plans">>;

export const goalPlanInsertSchema = z.object({
  user_id: uuidSchema,
  name: z.string().min(1),
  goal_type: z.enum(goalTypes).default("cut"),
  start_date: isoDateSchema,
  end_date: isoDateSchema.optional(),
  target_weight_kg: nullableNumberField,
  activity_level: optionalTextField,
  constitution_type: optionalTextField,
  training_focus: optionalTextField,
  protein_target_g: z.coerce.number().int().min(0).optional(),
  is_active: z.boolean().default(true),
  notes: optionalTextField,
}) satisfies z.ZodType<Omit<TableInsert<"goal_plans">, "id" | "created_at" | "updated_at">>;

export const goalPlanUpdateSchema =
  goalPlanInsertSchema.partial() satisfies z.ZodType<TableUpdate<"goal_plans">>;

export const goalPlanDraftSchema = z.object({
  name: z.string().trim().min(1),
  goal_type: z.enum(goalTypes).default("cut"),
  start_date: isoDateSchema,
  end_date: isoDateSchema.optional(),
  target_weight_kg: nullableNumberField,
  activity_level: optionalTextField,
  constitution_type: optionalTextField,
  training_focus: optionalTextField,
  protein_target_g: z.coerce.number().int().min(0).optional(),
  is_active: z.boolean().default(true),
  notes: optionalTextField,
});

export type GoalPlanDraft = z.infer<typeof goalPlanDraftSchema>;
