import { z } from "zod";
import { contextTypes, mealTypes } from "@/lib/types/enums";
import type { TableInsert, TableRow, TableUpdate } from "@/lib/types/database";
import {
  isoDateSchema,
  isoDateTimeSchema,
  optionalTextField,
  uuidSchema,
} from "@/lib/schema/shared";

const mealTotalsSchema = z.object({
  total_kcal: z.coerce.number().min(0).default(0),
  total_carbs_g: z.coerce.number().min(0).default(0),
  total_protein_g: z.coerce.number().min(0).default(0),
  total_fat_g: z.coerce.number().min(0).default(0),
});

export const mealSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  meal_date: isoDateSchema,
  eaten_at: isoDateTimeSchema.nullable(),
  meal_type: z.enum(mealTypes),
  context_type: z.enum(contextTypes),
  note: z.string().nullable(),
  imported_legacy: z.boolean(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
  ...mealTotalsSchema.shape,
}) satisfies z.ZodType<TableRow<"meals">>;

export const mealEntrySchema = z.object({
  id: uuidSchema,
  meal_id: uuidSchema,
  food_item_id: uuidSchema.nullable(),
  custom_food_name: z.string().nullable(),
  quantity: z.number(),
  unit: z.string(),
  kcal: z.number(),
  carbs_g: z.number(),
  protein_g: z.number(),
  fat_g: z.number(),
  is_estimated: z.boolean(),
  memo: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"meal_entries">>;

export const mealEntryInsertSchema = z
  .object({
    food_item_id: uuidSchema.optional(),
    custom_food_name: optionalTextField,
    quantity: z.coerce.number().positive(),
    unit: z.string().min(1),
    kcal: z.coerce.number().min(0).default(0),
    carbs_g: z.coerce.number().min(0).default(0),
    protein_g: z.coerce.number().min(0).default(0),
    fat_g: z.coerce.number().min(0).default(0),
    is_estimated: z.boolean().default(false),
    memo: optionalTextField,
  })
  .refine(
    (entry) => Boolean(entry.food_item_id) || Boolean(entry.custom_food_name),
    {
      message: "food_item_id 또는 custom_food_name 중 하나는 필요합니다.",
      path: ["custom_food_name"],
    },
  );

const mealBaseSchema = z.object({
  meal_date: isoDateSchema,
  eaten_at: isoDateTimeSchema.optional(),
  meal_type: z.enum(mealTypes),
  context_type: z.enum(contextTypes).default("default"),
  note: optionalTextField,
  imported_legacy: z.boolean().default(false),
  entries: z.array(mealEntryInsertSchema).min(1),
});

export const mealInsertSchema = z.object({
  user_id: uuidSchema,
  ...mealBaseSchema.shape,
}) satisfies z.ZodType<
  Omit<TableInsert<"meals">, "id" | "created_at" | "updated_at" | keyof typeof mealTotalsSchema.shape> & {
    entries: Array<Omit<TableInsert<"meal_entries">, "id" | "meal_id" | "created_at" | "updated_at">>;
  }
>;

export const mealUpdateSchema = z.object({
  meal_date: isoDateSchema.optional(),
  eaten_at: isoDateTimeSchema.optional(),
  meal_type: z.enum(mealTypes).optional(),
  context_type: z.enum(contextTypes).optional(),
  note: optionalTextField,
  imported_legacy: z.boolean().optional(),
}) satisfies z.ZodType<Partial<Omit<TableUpdate<"meals">, "user_id">>>;

export const mealDraftSchema = mealBaseSchema;

export type MealInsert = z.infer<typeof mealInsertSchema>;
export type MealDraft = z.infer<typeof mealDraftSchema>;
