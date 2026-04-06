import { z } from "zod";
import { macroStatuses } from "@/lib/types/enums";
import type { TableInsert, TableRow, TableUpdate } from "@/lib/types/database";
import {
  isoDateTimeSchema,
  nullableNumberField,
  optionalTextField,
  uuidSchema,
} from "@/lib/schema/shared";

export const foodItemSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  name: z.string(),
  food_group: z.string().nullable(),
  base_quantity: z.number(),
  base_unit: z.string(),
  kcal: z.number().nullable(),
  carbs_g: z.number().nullable(),
  protein_g: z.number().nullable(),
  fat_g: z.number().nullable(),
  macro_status: z.enum(macroStatuses),
  is_macro_estimated: z.boolean(),
  is_favorite: z.boolean(),
  is_active: z.boolean(),
  source: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: isoDateTimeSchema,
  updated_at: isoDateTimeSchema,
}) satisfies z.ZodType<TableRow<"food_items">>;

export const foodItemInsertSchema = z.object({
  user_id: uuidSchema,
  name: z.string().min(1),
  food_group: optionalTextField,
  base_quantity: z.coerce.number().positive(),
  base_unit: z.string().min(1),
  kcal: nullableNumberField,
  carbs_g: nullableNumberField,
  protein_g: nullableNumberField,
  fat_g: nullableNumberField,
  macro_status: z.enum(macroStatuses).default("complete"),
  is_macro_estimated: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
  is_active: z.boolean().default(true),
  source: optionalTextField,
  notes: optionalTextField,
}) satisfies z.ZodType<Omit<TableInsert<"food_items">, "id" | "created_at" | "updated_at">>;

export const foodItemUpdateSchema =
  foodItemInsertSchema.partial() satisfies z.ZodType<TableUpdate<"food_items">>;

export const foodItemDraftSchema = z.object({
  name: z.string().trim().min(1),
  food_group: optionalTextField,
  base_quantity: z.coerce.number().positive(),
  base_unit: z.string().trim().min(1),
  kcal: nullableNumberField,
  carbs_g: nullableNumberField,
  protein_g: nullableNumberField,
  fat_g: nullableNumberField,
  macro_status: z.enum(macroStatuses).default("complete"),
  is_macro_estimated: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
  notes: optionalTextField,
});

export type FoodItemDraft = z.infer<typeof foodItemDraftSchema>;
