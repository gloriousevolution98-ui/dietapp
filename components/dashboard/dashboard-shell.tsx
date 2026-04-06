import { AlertsCard } from "@/components/dashboard/alerts-card";
import { DayOverviewCard } from "@/components/dashboard/day-overview-card";
import { ProteinProgressCard } from "@/components/dashboard/protein-progress-card";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { TodayRoutineCard } from "@/components/dashboard/today-routine-card";
import { WeeklyCardioCard } from "@/components/dashboard/weekly-cardio-card";
import { WeightTrendCard } from "@/components/dashboard/weight-trend-card";
import type { DashboardSnapshot } from "@/lib/domain/dashboard/types";

type DashboardShellProps = {
  snapshot: DashboardSnapshot;
};

export function DashboardShell({ snapshot }: DashboardShellProps) {
  return (
    <main className="space-y-5 pb-4">
      <DayOverviewCard snapshot={snapshot} />
      <RecommendationCard recommendation={snapshot.recommendation} />
      <div className="grid grid-cols-2 gap-3">
        <ProteinProgressCard
          consumed={snapshot.protein.consumed}
          target={snapshot.protein.target}
        />
        <WeeklyCardioCard cardio={snapshot.weeklyCardio} />
      </div>
      <WeightTrendCard points={snapshot.weightTrend} />
      <TodayRoutineCard routine={snapshot.todayRoutine} />
      <AlertsCard alerts={snapshot.alerts} />
    </main>
  );
}
