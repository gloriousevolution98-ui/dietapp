import { z } from "zod";
import type { Json } from "@/lib/types/database";

export const uuidSchema = z.uuid();
export const isoDateSchema = z.iso.date();
export const isoDateTimeSchema = z.iso.datetime({ offset: true });
export const jsonValueSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.record(z.string(), jsonValueSchema),
    z.array(jsonValueSchema),
  ]),
);

export const optionalNumberField = z
  .union([z.coerce.number(), z.nan()])
  .optional()
  .transform((value) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return undefined;
    }

    return value;
  });

export const nullableNumberField = z
  .union([z.coerce.number(), z.nan(), z.null()])
  .optional()
  .transform((value) => {
    if (value === null) {
      return null;
    }

    if (typeof value !== "number" || Number.isNaN(value)) {
      return undefined;
    }

    return value;
  });

export const textField = z.string().trim();
export const optionalTextField = textField.min(1).optional();
