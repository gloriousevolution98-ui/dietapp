import type { ContextType, MealType } from "@/lib/types/enums";

export type FavoriteFood = {
  name: string;
  quantity: number;
  unit: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
};

export type LoggedMeal = {
  id: string;
  mealType: MealType;
  mealTypeLabel: string;
  contextType: ContextType;
  contextLabel: string;
  eatenAtLabel: string;
  note?: string;
  totals: {
    kcal: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  entries: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    kcal: number;
    carbs: number;
    protein: number;
    fat: number;
  }>;
};

export type MealContextOption = {
  value: ContextType;
  label: string;
};
