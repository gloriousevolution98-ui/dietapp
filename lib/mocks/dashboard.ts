import type { DashboardSnapshot } from "@/lib/domain/dashboard/types";

export const mockDashboardSnapshot: DashboardSnapshot = {
  dateLabel: "2026.04.06 Monday",
  dayTypeLabel: "회복일 + 운동일",
  programDay: "Back Day",
  focusCopy:
    "굶지 말고 기본 식단으로 복귀하면서 등 운동 퍼포먼스를 지키는 구성이 우선입니다.",
  stats: [
    { label: "Protein", value: "170g" },
    { label: "Lunch Rice", value: "100-150g" },
    { label: "Dinner Rice", value: "50-100g" },
  ],
  recommendation: {
    title: "과식 다음 날 복귀 가이드",
    badge: "Recovery",
    lines: [
      { label: "점심 밥", value: "100-150g" },
      { label: "저녁 밥", value: "50-100g" },
      { label: "단백질 보강", value: "쉐이크 1회" },
      { label: "오늘 유산소", value: "천국의 계단 30분" },
      { label: "오늘 교정", value: "90/90 + dead bug" },
    ],
    note: "노탄수 벌칙 대신 지방만 낮추고 활동량을 유지하는 구조를 기본값으로 둡니다.",
  },
  protein: {
    consumed: 112,
    target: 170,
  },
  weeklyCardio: {
    sessions: 3,
    totalMinutes: 90,
    week: [true, false, true, true, false, false, false],
  },
  weightTrend: [
    { day: "Tue", weight: 83.4 },
    { day: "Wed", weight: 83.1 },
    { day: "Thu", weight: 82.9 },
    { day: "Fri", weight: 83.0 },
    { day: "Sat", weight: 82.8 },
    { day: "Sun", weight: 82.7 },
    { day: "Mon", weight: 82.6 },
  ],
  todayRoutine: {
    name: "등 / 상체 우선",
    progress: "1 of 5 complete",
    items: [
      { name: "90/90 Breathing", target: "2 sets of 5 breaths", emphasis: "Prep" },
      { name: "Barbell Row", target: "4 sets · 6-8 reps · RIR 2", emphasis: "Up Next" },
      { name: "Lat Pulldown", target: "3 sets · 8-10 reps · RIR 2" },
      { name: "Seated Row", target: "3 sets · 10-12 reps · RIR 1-2" },
    ],
  },
  alerts: ["전날 과식", "수면 6.0h", "하체 피로 낮음"],
};
