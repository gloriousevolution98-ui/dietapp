import type { MealContextOption, FavoriteFood, LoggedMeal } from "@/lib/domain/meals/types";

export const contextOptions: MealContextOption[] = [
  { value: "default", label: "기본" },
  { value: "training", label: "운동일" },
  { value: "one_appointment", label: "한 끼 약속" },
  { value: "two_appointments", label: "두 끼 약속" },
  { value: "recovery", label: "회복" },
];

export const favoriteFoods: FavoriteFood[] = [
  {
    name: "프로틴쉐이크",
    quantity: 1,
    unit: "serving",
    kcal: 140,
    carbs: 5,
    protein: 27,
    fat: 2,
  },
  {
    name: "뒷다리살",
    quantity: 200,
    unit: "g",
    kcal: 280,
    carbs: 0,
    protein: 44,
    fat: 10,
  },
  {
    name: "현미밥",
    quantity: 150,
    unit: "g",
    kcal: 230,
    carbs: 51,
    protein: 4,
    fat: 1,
  },
  {
    name: "그릭요거트",
    quantity: 150,
    unit: "g",
    kcal: 120,
    carbs: 7,
    protein: 15,
    fat: 2,
  },
];

export const initialMeals: LoggedMeal[] = [
  {
    id: "meal-1",
    mealType: "breakfast",
    mealTypeLabel: "아침",
    contextType: "training",
    contextLabel: "운동일",
    eatenAtLabel: "08:20",
    totals: {
      kcal: 260,
      carbs: 12,
      protein: 42,
      fat: 5,
    },
    entries: [
      {
        id: "entry-1",
        name: "프로틴쉐이크",
        quantity: 1,
        unit: "serving",
        kcal: 140,
        carbs: 5,
        protein: 27,
        fat: 2,
      },
      {
        id: "entry-2",
        name: "그릭요거트",
        quantity: 150,
        unit: "g",
        kcal: 120,
        carbs: 7,
        protein: 15,
        fat: 3,
      },
    ],
  },
  {
    id: "meal-2",
    mealType: "lunch",
    mealTypeLabel: "점심",
    contextType: "recovery",
    contextLabel: "회복",
    eatenAtLabel: "12:35",
    note: "전날 과식 후 지방 낮춤",
    totals: {
      kcal: 510,
      carbs: 58,
      protein: 48,
      fat: 8,
    },
    entries: [
      {
        id: "entry-3",
        name: "현미밥",
        quantity: 150,
        unit: "g",
        kcal: 230,
        carbs: 51,
        protein: 4,
        fat: 1,
      },
      {
        id: "entry-4",
        name: "뒷다리살",
        quantity: 200,
        unit: "g",
        kcal: 280,
        carbs: 7,
        protein: 44,
        fat: 7,
      },
    ],
  },
];
