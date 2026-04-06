"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MealCard } from "@/components/meals/meal-card";
import { MealEntrySheet } from "@/components/meals/meal-entry-sheet";
import { MealSummaryCard } from "@/components/meals/meal-summary-card";
import { MealTabs } from "@/components/meals/meal-tabs";
import { calculateDailyMealTotals } from "@/lib/domain/meals/calculate-meal-totals";
import type {
  FavoriteFood,
  LoggedMeal,
  MealContextOption,
} from "@/lib/domain/meals/types";
import { contextOptions } from "@/lib/mocks/meals";
import type { MealDraft } from "@/lib/schema/meal";
import type { SaveMealResult } from "@/app/(app)/meals/actions";

type MealLogScreenProps = {
  initialMeals: LoggedMeal[];
  favoriteFoods: FavoriteFood[];
  saveMeal: (draft: MealDraft) => Promise<SaveMealResult>;
};

export function MealLogScreen({
  initialMeals,
  favoriteFoods,
  saveMeal,
}: MealLogScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Today" | "History" | "Templates" | "Foods">("Today");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [meals, setMeals] = useState<LoggedMeal[]>(initialMeals);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const totals = calculateDailyMealTotals(meals);

  async function handleSaveMeal(draft: MealDraft) {
    setIsSaving(true);

    const result = await saveMeal(draft);

    if (!result.success) {
      setSubmitError(result.error);
      setIsSaving(false);
      return false;
    }

    setMeals((current) => [result.meal, ...current]);
    setSubmitError(null);
    setIsComposerOpen(false);
    setIsSaving(false);
    router.refresh();

    return true;
  }

  return (
    <>
      <main className="space-y-5 pb-24">
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Meals
          </p>
          <div>
            <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">
              식사 기록
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
              Today 화면에서 자주 먹는 음식과 현재 총합을 바로 보면서 식사를 추가합니다.
            </p>
          </div>
        </section>

        <MealTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "Today" ? (
          <>
            <MealSummaryCard
              mealsCount={totals.mealsCount}
              totalKcal={totals.kcal}
              totalProtein={totals.protein}
              totalCarbs={totals.carbs}
              totalFat={totals.fat}
            />
            <section className="space-y-3">
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </section>
            {submitError ? (
              <p className="text-sm text-[#9b2c2c]">{submitError}</p>
            ) : null}
          </>
        ) : (
          <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
            <p className="text-sm leading-6 text-[var(--muted)]">
              `{activeTab}` 탭은 이번 단계에서 라우트 구조만 열어두고, 실제 데이터/템플릿/푸드 마스터 연결은 다음 작업으로 넘깁니다.
            </p>
          </section>
        )}
      </main>

      <button
        type="button"
        onClick={() => setIsComposerOpen(true)}
        className="fixed bottom-24 right-4 z-20 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(31,24,18,0.22)]"
      >
        + 식사 추가
      </button>

      <MealEntrySheet
        isOpen={isComposerOpen}
        favoriteFoods={favoriteFoods}
        contextOptions={contextOptions as MealContextOption[]}
        onClose={() => setIsComposerOpen(false)}
        onSave={handleSaveMeal}
        isSaving={isSaving}
      />
    </>
  );
}
