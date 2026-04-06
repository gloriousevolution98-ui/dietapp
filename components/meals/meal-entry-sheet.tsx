"use client";

import { useMemo, useState } from "react";
import { mealDraftSchema, mealEntryInsertSchema, type MealDraft } from "@/lib/schema/meal";
import type { FavoriteFood, MealContextOption } from "@/lib/domain/meals/types";

type DraftEntry = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
};

type MealEntrySheetProps = {
  isOpen: boolean;
  favoriteFoods: FavoriteFood[];
  contextOptions: MealContextOption[];
  onClose: () => void;
  onSave: (draft: MealDraft) => Promise<boolean>;
  isSaving: boolean;
};

const mealTypeOptions = [
  { value: "breakfast", label: "아침" },
  { value: "lunch", label: "점심" },
  { value: "snack", label: "간식" },
  { value: "dinner", label: "저녁" },
  { value: "late_night", label: "야식" },
] as const;

function toIsoDateTime(date: string, time: string) {
  if (!date || !time) {
    return undefined;
  }

  return new Date(`${date}T${time}:00`).toISOString();
}

export function MealEntrySheet({
  isOpen,
  favoriteFoods,
  contextOptions,
  onClose,
  onSave,
  isSaving,
}: MealEntrySheetProps) {
  const now = useMemo(() => new Date(), []);
  const [mealType, setMealType] = useState<MealDraft["meal_type"]>("lunch");
  const [mealDate, setMealDate] = useState(now.toISOString().slice(0, 10));
  const [mealTime, setMealTime] = useState(
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
  );
  const [contextType, setContextType] =
    useState<MealDraft["context_type"]>("default");
  const [note, setNote] = useState("");
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("serving");
  const [kcal, setKcal] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [protein, setProtein] = useState("0");
  const [fat, setFat] = useState("0");
  const [entries, setEntries] = useState<DraftEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  function resetEntryFields() {
    setFoodName("");
    setQuantity("1");
    setUnit("serving");
    setKcal("0");
    setCarbs("0");
    setProtein("0");
    setFat("0");
  }

  function applyFavorite(food: FavoriteFood) {
    setFoodName(food.name);
    setQuantity(String(food.quantity));
    setUnit(food.unit);
    setKcal(String(food.kcal));
    setCarbs(String(food.carbs));
    setProtein(String(food.protein));
    setFat(String(food.fat));
  }

  function addEntry() {
    const parsed = mealEntryInsertSchema.safeParse({
      custom_food_name: foodName,
      quantity,
      unit,
      kcal,
      carbs_g: carbs,
      protein_g: protein,
      fat_g: fat,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인하세요.");
      return;
    }

    setEntries((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: parsed.data.custom_food_name ?? "Unnamed food",
        quantity: parsed.data.quantity,
        unit: parsed.data.unit,
        kcal: parsed.data.kcal,
        carbs: parsed.data.carbs_g,
        protein: parsed.data.protein_g,
        fat: parsed.data.fat_g,
      },
    ]);
    setError(null);
    resetEntryFields();
  }

  async function saveMeal() {
    const draft = mealDraftSchema.safeParse({
      meal_date: mealDate,
      eaten_at: toIsoDateTime(mealDate, mealTime),
      meal_type: mealType,
      context_type: contextType,
      note: note || undefined,
      entries: entries.map((entry) => ({
        custom_food_name: entry.name,
        quantity: entry.quantity,
        unit: entry.unit,
        kcal: entry.kcal,
        carbs_g: entry.carbs,
        protein_g: entry.protein,
        fat_g: entry.fat,
      })),
    });

    if (!draft.success) {
      setError(draft.error.issues[0]?.message ?? "식사 정보를 확인하세요.");
      return;
    }

    const saved = await onSave(draft.data);

    if (saved) {
      setEntries([]);
      setNote("");
      setContextType("default");
      setMealType("lunch");
      setError(null);
      resetEntryFields();
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-[rgba(20,16,12,0.42)]">
      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[90vh] w-full max-w-md flex-col rounded-t-[32px] bg-[var(--surface-strong)] px-4 pb-6 pt-4 shadow-[0_-20px_50px_rgba(31,24,18,0.18)]">
        <div className="mx-auto h-1.5 w-16 rounded-full bg-[rgba(106,98,89,0.24)]" />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Add Meal
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
              식사 추가
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[rgba(120,103,85,0.12)] px-3 py-2 text-sm text-[var(--muted)]"
          >
            닫기
          </button>
        </div>

        <div className="mt-5 overflow-y-auto pb-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Meal
              </span>
              <select
                value={mealType}
                onChange={(event) =>
                  setMealType(event.target.value as MealDraft["meal_type"])
                }
                className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
              >
                {mealTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Context
              </span>
              <select
                value={contextType}
                onChange={(event) =>
                  setContextType(event.target.value as MealDraft["context_type"])
                }
                className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
              >
                {contextOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Date
              </span>
              <input
                type="date"
                value={mealDate}
                onChange={(event) => setMealDate(event.target.value)}
                className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Time
              </span>
              <input
                type="time"
                value={mealTime}
                onChange={(event) => setMealTime(event.target.value)}
                className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
              />
            </label>
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              One Tap Foods
            </p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {favoriteFoods.map((food) => (
                <button
                  key={food.name}
                  type="button"
                  onClick={() => applyFavorite(food)}
                  className="shrink-0 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--foreground)]"
                >
                  {food.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[24px] bg-[rgba(245,243,236,0.9)] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Entry
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="col-span-2 space-y-2">
                <span className="text-sm text-[var(--muted)]">음식명</span>
                <input
                  value={foodName}
                  onChange={(event) => setFoodName(event.target.value)}
                  className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
                  placeholder="예: 닭가슴살"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[var(--muted)]">수량</span>
                <input
                  inputMode="decimal"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[var(--muted)]">단위</span>
                <input
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                  className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[var(--muted)]">Protein</span>
                <input
                  inputMode="decimal"
                  value={protein}
                  onChange={(event) => setProtein(event.target.value)}
                  className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[var(--muted)]">Carbs</span>
                <input
                  inputMode="decimal"
                  value={carbs}
                  onChange={(event) => setCarbs(event.target.value)}
                  className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[var(--muted)]">Fat</span>
                <input
                  inputMode="decimal"
                  value={fat}
                  onChange={(event) => setFat(event.target.value)}
                  className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-[var(--muted)]">Kcal</span>
                <input
                  inputMode="decimal"
                  value={kcal}
                  onChange={(event) => setKcal(event.target.value)}
                  className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={addEntry}
              className="mt-4 w-full rounded-[20px] bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-white"
            >
              엔트리 추가
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-[20px] border border-[var(--line)] bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {entry.name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {entry.quantity}
                    {entry.unit}
                  </p>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {entry.kcal} kcal · P {entry.protein} / C {entry.carbs} / F{" "}
                  {entry.fat}
                </p>
              </div>
            ))}
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Memo
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              className="w-full rounded-[18px] border border-[var(--line)] bg-white px-3 py-3"
              placeholder="예: 저녁 약속 전이라 탄수 낮춤"
            />
          </label>

          {error ? (
            <p className="mt-4 text-sm text-[#9b2c2c]">{error}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={saveMeal}
          disabled={isSaving}
          className="mt-4 w-full rounded-[22px] bg-[var(--accent)] px-4 py-4 text-base font-semibold text-white"
        >
          {isSaving ? "저장 중..." : "식사 저장"}
        </button>
      </div>
    </div>
  );
}
