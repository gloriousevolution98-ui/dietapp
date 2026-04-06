export type DashboardSnapshot = {
  dateLabel: string;
  dayTypeLabel: string;
  programDay: string;
  focusCopy: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  recommendation: {
    title: string;
    badge: string;
    lines: Array<{
      label: string;
      value: string;
    }>;
    note: string;
    isPlaceholder?: boolean;
  };
  protein: {
    consumed: number;
    target: number;
  };
  weeklyCardio: {
    sessions: number;
    totalMinutes: number;
    week: boolean[];
  };
  weightTrend: Array<{
    day: string;
    weight: number;
  }>;
  todayRoutine: {
    name: string;
    progress: string;
    items: Array<{
      name: string;
      target: string;
      emphasis?: string;
    }>;
    isPlaceholder?: boolean;
  };
  alerts: string[];
};
