import type { TableRow } from "@/lib/types/database";
import type { DashboardSnapshot } from "@/lib/domain/dashboard/types";

type ProfileRow = TableRow<"profiles">;
type MealRow = TableRow<"meals">;
type CardioRow = TableRow<"cardio_logs">;
type BodyMetricRow = TableRow<"body_metrics">;
type CheckinRow = TableRow<"daily_checkins">;

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    timeZone: "Asia/Seoul",
  }).format(date);
}

function getWeekWindow(today: Date) {
  const day = today.getDay();
  const diffToMonday = (day + 6) % 7;
  const start = new Date(today);
  start.setDate(today.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function inferDayType(checkin?: CheckinRow | null) {
  if (!checkin) {
    return "기본일";
  }

  if (checkin.prev_day_overeat && checkin.trained_today) {
    return "회복일 + 운동일";
  }

  if (checkin.prev_day_overeat) {
    return "회복일";
  }

  if (checkin.appointments_count >= 2) {
    return "두 끼 약속";
  }

  if (checkin.appointments_count === 1) {
    return "한 끼 약속";
  }

  if (checkin.trained_today) {
    return "운동일";
  }

  return "기본일";
}

export function buildDashboardSnapshot(input: {
  today: Date;
  profile: ProfileRow | null;
  todayMeals: MealRow[];
  weekCardioLogs: CardioRow[];
  recentBodyMetrics: BodyMetricRow[];
  todayCheckin: CheckinRow | null;
}): DashboardSnapshot {
  const { today, profile, todayMeals, weekCardioLogs, recentBodyMetrics, todayCheckin } =
    input;
  const proteinConsumed = todayMeals.reduce(
    (sum, meal) => sum + meal.total_protein_g,
    0,
  );
  const todayKcal = todayMeals.reduce((sum, meal) => sum + meal.total_kcal, 0);
  const { start: weekStart } = getWeekWindow(today);
  const weekFlags = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = date.toISOString().slice(0, 10);

    return weekCardioLogs.some((log) => (log.performed_at ?? "").slice(0, 10) === key);
  });
  const weightTrend = [...recentBodyMetrics]
    .sort((a, b) => a.recorded_on.localeCompare(b.recorded_on))
    .slice(-7)
    .map((metric) => ({
      day: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        timeZone: "Asia/Seoul",
      }).format(new Date(metric.recorded_on)),
      weight: metric.weight_kg ?? 0,
    }))
    .filter((point) => point.weight > 0);

  const alerts: string[] = [];

  if (todayCheckin?.prev_day_overeat) {
    alerts.push("전날 과식");
  }

  if ((todayCheckin?.sleep_hours ?? 24) < 6) {
    alerts.push(`수면 ${todayCheckin?.sleep_hours?.toFixed(1) ?? "0.0"}h`);
  }

  if ((todayCheckin?.appointments_count ?? 0) > 0) {
    alerts.push(`약속 ${todayCheckin?.appointments_count}회`);
  }

  if (alerts.length === 0) {
    alerts.push("주의 알림 없음");
  }

  return {
    dateLabel: formatDateLabel(today),
    dayTypeLabel: inferDayType(todayCheckin),
    programDay: "Program 미연결",
    focusCopy:
      "지금 단계에서는 meal, cardio, body metric 실데이터를 먼저 반영하고 추천 엔진과 프로그램 연결은 다음 단계로 둡니다.",
    stats: [
      {
        label: "Protein",
        value: `${Math.round(profile?.protein_target_g ?? 170)}g`,
      },
      {
        label: "Meals",
        value: `${todayMeals.length} logged`,
      },
      {
        label: "Kcal",
        value: `${Math.round(todayKcal)}`,
      },
    ],
    recommendation: {
      title: "추천 엔진 연결 전",
      badge: "Placeholder",
      lines: [
        { label: "점심 밥", value: "rule engine 연결 예정" },
        { label: "저녁 밥", value: "rule engine 연결 예정" },
        { label: "단백질 보강", value: "오늘 단백질 합계만 실데이터" },
        { label: "오늘 유산소", value: "weekly cardio만 실데이터" },
        { label: "오늘 교정", value: "다음 단계" },
      ],
      note: "추천 카드는 아직 실제 규칙 엔진을 붙이지 않았습니다.",
      isPlaceholder: true,
    },
    protein: {
      consumed: Math.round(proteinConsumed),
      target: profile?.protein_target_g ?? 170,
    },
    weeklyCardio: {
      sessions: weekCardioLogs.length,
      totalMinutes: weekCardioLogs.reduce(
        (sum, log) => sum + log.duration_min,
        0,
      ),
      week: weekFlags,
    },
    weightTrend:
      weightTrend.length > 0
        ? weightTrend
        : [{ day: "N/A", weight: 0 }],
    todayRoutine: {
      name: "루틴 연결 전",
      progress: "program 미연결",
      items: [
        { name: "Program", target: "workout_programs 연결 예정", emphasis: "Next" },
        { name: "Progressive overload", target: "strength logs 연결 예정" },
        { name: "Corrective routine", target: "rule engine 이후 연결" },
      ],
      isPlaceholder: true,
    },
    alerts,
  };
}
