import type { DashboardSnapshot } from "@/lib/domain/dashboard/types";

type AlertsCardProps = {
  alerts: DashboardSnapshot["alerts"];
};

export function AlertsCard({ alerts }: AlertsCardProps) {
  return (
    <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
        Alerts
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {alerts.map((alert) => (
          <span
            key={alert}
            className="rounded-full border border-[rgba(159,90,47,0.12)] bg-[var(--surface-strong)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
          >
            {alert}
          </span>
        ))}
      </div>
    </section>
  );
}
