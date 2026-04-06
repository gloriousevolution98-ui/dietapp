"use server";

import { revalidatePath } from "next/cache";
import { parseCsv } from "@/lib/domain/import/parse-csv";
import { foodItemDraftSchema } from "@/lib/schema/food";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ImportSummary = {
  successCount: number;
  failureCount: number;
  missingMacroRows: string[];
  errors: Array<{
    rowNumber: number;
    reason: string;
  }>;
};

export type FoodImportResult =
  | {
      success: true;
      summary: ImportSummary;
    }
  | {
      success: false;
      error: string;
    };

function toOptionalString(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toOptionalNumber(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function importFoodMasterAction(
  input: FormData,
): Promise<FoodImportResult> {
  const file = input.get("file");

  if (!(file instanceof File)) {
    return {
      success: false,
      error: "CSV 파일이 필요합니다.",
    };
  }

  const text = await file.text();
  const rows = parseCsv(text);

  if (rows.length === 0) {
    return {
      success: false,
      error: "비어 있는 CSV입니다.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "로그인이 필요합니다.",
    };
  }

  const [header, ...bodyRows] = rows;
  const summary: ImportSummary = {
    successCount: 0,
    failureCount: 0,
    missingMacroRows: [],
    errors: [],
  };

  for (let index = 0; index < bodyRows.length; index += 1) {
    const row = bodyRows[index];
    const cells = Object.fromEntries(header.map((column, colIndex) => [column, row[colIndex]]));

    const name =
      toOptionalString(cells["음식명"]) ??
      toOptionalString(cells["name"]) ??
      toOptionalString(cells["Name"]);

    if (!name) {
      summary.failureCount += 1;
      summary.errors.push({
        rowNumber: index + 2,
        reason: "음식명이 없습니다.",
      });
      continue;
    }

    const kcal = toOptionalNumber(cells["칼로리"] ?? cells["kcal"]);
    const carbs = toOptionalNumber(cells["탄수화물"] ?? cells["carbs_g"]);
    const protein = toOptionalNumber(cells["단백질"] ?? cells["protein_g"]);
    const fat = toOptionalNumber(cells["지방"] ?? cells["fat_g"]);

    const parsed = foodItemDraftSchema.safeParse({
      name,
      food_group: toOptionalString(cells["음식군"] ?? cells["food_group"]),
      base_quantity:
        toOptionalNumber(cells["기준량"] ?? cells["base_quantity"]) ?? 1,
      base_unit:
        toOptionalString(cells["기준 단위"] ?? cells["base_unit"]) ?? "serving",
      kcal,
      carbs_g: carbs,
      protein_g: protein,
      fat_g: fat,
      macro_status:
        kcal === undefined || carbs === undefined || protein === undefined || fat === undefined
          ? "missing"
          : "complete",
      is_macro_estimated: false,
      is_favorite: false,
      notes: toOptionalString(cells["메모"] ?? cells["notes"]),
    });

    if (!parsed.success) {
      summary.failureCount += 1;
      summary.errors.push({
        rowNumber: index + 2,
        reason: parsed.error.issues[0]?.message ?? "파싱 실패",
      });
      continue;
    }

    const { error } = await supabase.from("food_items").insert({
      user_id: user.id,
      name: parsed.data.name,
      food_group: parsed.data.food_group,
      base_quantity: parsed.data.base_quantity,
      base_unit: parsed.data.base_unit,
      kcal: parsed.data.kcal,
      carbs_g: parsed.data.carbs_g,
      protein_g: parsed.data.protein_g,
      fat_g: parsed.data.fat_g,
      macro_status: parsed.data.macro_status,
      is_macro_estimated: parsed.data.is_macro_estimated,
      is_favorite: parsed.data.is_favorite,
      is_active: true,
      source: "import",
      notes: parsed.data.notes,
    });

    if (error) {
      summary.failureCount += 1;
      summary.errors.push({
        rowNumber: index + 2,
        reason: "DB insert 실패",
      });
      continue;
    }

    if (parsed.data.macro_status !== "complete") {
      summary.missingMacroRows.push(parsed.data.name);
    }

    summary.successCount += 1;
  }

  revalidatePath("/library/foods");
  revalidatePath("/meals");
  revalidatePath("/import");

  return {
    success: true,
    summary,
  };
}
