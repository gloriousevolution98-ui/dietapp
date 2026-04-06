"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  SaveFoodItemResult,
} from "@/app/(app)/library/foods/actions";
import { foodItemDraftSchema, type FoodItemDraft } from "@/lib/schema/food";
import type { TableRow } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

type FoodLibraryScreenProps = {
  foods: TableRow<"food_items">[];
  saveFood: (draft: FoodItemDraft) => Promise<SaveFoodItemResult>;
  toggleFavorite: (input: {
    id: string;
    isFavorite: boolean;
  }) => Promise<SaveFoodItemResult>;
};

const macroStatusOptions = [
  { value: "complete", label: "complete" },
  { value: "partial", label: "partial" },
  { value: "missing", label: "missing" },
] as const;

const emptyDraft: FoodItemDraft = {
  name: "",
  food_group: undefined,
  base_quantity: 100,
  base_unit: "g",
  kcal: undefined,
  carbs_g: undefined,
  protein_g: undefined,
  fat_g: undefined,
  macro_status: "complete",
  is_macro_estimated: false,
  is_favorite: false,
  notes: undefined,
};

export function FoodLibraryScreen({
  foods,
  saveFood,
  toggleFavorite,
}: FoodLibraryScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<FoodItemDraft>(emptyDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSaveFood() {
    const parsed = foodItemDraftSchema.safeParse(draft);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Food 입력값을 확인하세요.");
      setMessage(null);
      return;
    }

    setIsSaving(true);
    const result = await saveFood(parsed.data);
    setIsSaving(false);

    if (!result.success) {
      setError(result.error);
      setMessage(null);
      return;
    }

    setDraft(emptyDraft);
    setError(null);
    setMessage("Food Master에 저장했습니다.");
    router.refresh();
  }

  async function handleToggleFavorite(id: string, isFavorite: boolean) {
    const result = await toggleFavorite({ id, isFavorite });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setError(null);
    router.refresh();
  }

  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Food Library
        </p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">
            Food Master
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            자주 먹는 음식과 macro 기준값을 먼저 쌓아두면 Meal 입력의 one-tap preset으로 바로 연결됩니다.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[rgba(86,64,45,0.12)] bg-[linear-gradient(145deg,rgba(125,69,31,0.98),rgba(87,48,20,0.96))] p-5 text-white shadow-[0_24px_60px_rgba(78,48,23,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(255,232,209,0.78)]">
              Quick Link
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
              Meal 입력으로 돌아가기
            </h2>
          </div>
          <Link
            href="/meals"
            className="rounded-[20px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3 text-sm font-medium"
          >
            /meals
          </Link>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(71,55,38,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Add Food
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="col-span-2 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Name
            </span>
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              placeholder="예: 닭가슴살"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Group
            </span>
            <input
              value={draft.food_group ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  food_group: event.target.value || undefined,
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              placeholder="예: protein"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Macro Status
            </span>
            <select
              value={draft.macro_status}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  macro_status: event.target.value as FoodItemDraft["macro_status"],
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            >
              {macroStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Base Qty
            </span>
            <input
              inputMode="decimal"
              value={draft.base_quantity}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  base_quantity: Number(event.target.value || 0),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Unit
            </span>
            <input
              value={draft.base_unit}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  base_unit: event.target.value,
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Kcal
            </span>
            <input
              inputMode="decimal"
              value={draft.kcal ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  kcal: event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Protein
            </span>
            <input
              inputMode="decimal"
              value={draft.protein_g ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  protein_g:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Carbs
            </span>
            <input
              inputMode="decimal"
              value={draft.carbs_g ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  carbs_g:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Fat
            </span>
            <input
              inputMode="decimal"
              value={draft.fat_g ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  fat_g: event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <button
            type="button"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                is_favorite: !current.is_favorite,
              }))
            }
            className={cn(
              "rounded-[18px] px-4 py-3 text-sm font-semibold transition",
              draft.is_favorite
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-strong)] text-[var(--foreground)]",
            )}
          >
            {draft.is_favorite ? "즐겨찾기 포함" : "즐겨찾기 아님"}
          </button>
          <button
            type="button"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                is_macro_estimated: !current.is_macro_estimated,
              }))
            }
            className={cn(
              "rounded-[18px] px-4 py-3 text-sm font-semibold transition",
              draft.is_macro_estimated
                ? "bg-[var(--foreground)] text-white"
                : "bg-[var(--surface-strong)] text-[var(--foreground)]",
            )}
          >
            {draft.is_macro_estimated ? "추정 매크로" : "실측 매크로"}
          </button>
          <label className="col-span-2 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Notes
            </span>
            <textarea
              rows={3}
              value={draft.notes ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  notes: event.target.value || undefined,
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-[#9b2c2c]">{error}</p> : null}
        {message ? (
          <p className="mt-4 text-sm text-[var(--success)]">{message}</p>
        ) : null}

        <button
          type="button"
          onClick={handleSaveFood}
          disabled={isSaving}
          className="mt-5 w-full rounded-[22px] bg-[var(--foreground)] px-4 py-4 text-base font-semibold text-white"
        >
          {isSaving ? "저장 중..." : "Food 저장"}
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Active Foods
          </p>
          <p className="text-sm text-[var(--muted)]">{foods.length} items</p>
        </div>

        {foods.map((food) => (
          <article
            key={food.id}
            className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                    {food.name}
                  </h2>
                  <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                    {food.macro_status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {food.base_quantity}
                  {food.base_unit}
                  {food.food_group ? ` · ${food.food_group}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFavorite(food.id, food.is_favorite)}
                className={cn(
                  "rounded-full px-3 py-2 text-xs font-semibold",
                  food.is_favorite
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-strong)] text-[var(--muted)]",
                )}
              >
                {food.is_favorite ? "favorite" : "add favorite"}
              </button>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              K {food.kcal ?? 0} · P {food.protein_g ?? 0} · C {food.carbs_g ?? 0} · F{" "}
              {food.fat_g ?? 0}
            </p>
            {food.notes ? (
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {food.notes}
              </p>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
