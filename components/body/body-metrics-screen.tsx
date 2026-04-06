"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SaveBodyMetricResult } from "@/app/(app)/body/actions";
import { bodyMetricDraftSchema, type BodyMetricDraft } from "@/lib/schema/logs";
import type { TableRow } from "@/lib/types/database";

type BodyMetricsScreenProps = {
  initialMetrics: TableRow<"body_metrics">[];
  saveMetric: (draft: BodyMetricDraft) => Promise<SaveBodyMetricResult>;
};

const emptyDraft = (): BodyMetricDraft => ({
  recorded_on: new Date().toISOString().slice(0, 10),
  weight_kg: undefined,
  waist_cm: undefined,
  body_fat_pct: undefined,
  skeletal_muscle_kg: undefined,
  fat_mass_kg: undefined,
  visceral_fat_level: undefined,
  inbody_score: undefined,
  notes: undefined,
});

function formatRecordedOn(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(date));
}

export function BodyMetricsScreen({
  initialMetrics,
  saveMetric,
}: BodyMetricsScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<BodyMetricDraft>(emptyDraft);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    const parsed = bodyMetricDraftSchema.safeParse(draft);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인하세요.");
      setMessage(null);
      return;
    }

    setIsSaving(true);
    const result = await saveMetric(parsed.data);
    setIsSaving(false);

    if (!result.success) {
      setError(result.error);
      setMessage(null);
      return;
    }

    setMetrics((current) => [
      {
        id: crypto.randomUUID(),
        user_id: "",
        recorded_on: parsed.data.recorded_on,
        weight_kg: parsed.data.weight_kg ?? null,
        waist_cm: parsed.data.waist_cm ?? null,
        body_fat_pct: parsed.data.body_fat_pct ?? null,
        skeletal_muscle_kg: parsed.data.skeletal_muscle_kg ?? null,
        fat_mass_kg: parsed.data.fat_mass_kg ?? null,
        visceral_fat_level: parsed.data.visceral_fat_level ?? null,
        inbody_score: parsed.data.inbody_score ?? null,
        source: "manual",
        notes: parsed.data.notes ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ...current,
    ]);
    setDraft(emptyDraft());
    setError(null);
    setMessage("바디 지표를 저장했습니다.");
    router.refresh();
  }

  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Body
        </p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">
            바디 지표
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            체중과 허리, InBody 항목을 간단히 저장하면 대시보드의 최근 7일 체중 추세와 함께 복기할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(71,55,38,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Body Input
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="col-span-2 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Recorded On
            </span>
            <input
              type="date"
              value={draft.recorded_on}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  recorded_on: event.target.value,
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Weight
            </span>
            <input
              inputMode="decimal"
              value={draft.weight_kg ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  weight_kg:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              placeholder="kg"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Waist
            </span>
            <input
              inputMode="decimal"
              value={draft.waist_cm ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  waist_cm:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              placeholder="cm"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Body Fat %
            </span>
            <input
              inputMode="decimal"
              value={draft.body_fat_pct ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  body_fat_pct:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Skeletal Muscle
            </span>
            <input
              inputMode="decimal"
              value={draft.skeletal_muscle_kg ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  skeletal_muscle_kg:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Fat Mass
            </span>
            <input
              inputMode="decimal"
              value={draft.fat_mass_kg ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  fat_mass_kg:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Visceral Fat
            </span>
            <input
              inputMode="numeric"
              value={draft.visceral_fat_level ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  visceral_fat_level:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              InBody Score
            </span>
            <input
              inputMode="numeric"
              value={draft.inbody_score ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  inbody_score:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
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
              placeholder="복부 팽만감, 컨디션, InBody 메모"
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-[#9b2c2c]">{error}</p> : null}
        {message ? (
          <p className="mt-4 text-sm text-[var(--success)]">{message}</p>
        ) : null}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="mt-5 w-full rounded-[22px] bg-[var(--foreground)] px-4 py-4 text-base font-semibold text-white"
        >
          {isSaving ? "저장 중..." : "바디 지표 저장"}
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Recent Records
          </p>
          <p className="text-sm text-[var(--muted)]">{metrics.length} records</p>
        </div>
        {metrics.map((metric) => (
          <article
            key={metric.id}
            className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  {formatRecordedOn(metric.recorded_on)}
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  체중 {metric.weight_kg ?? "-"}kg · 허리 {metric.waist_cm ?? "-"}cm
                </p>
              </div>
              <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">
                {metric.source ?? "manual"}
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              체지방 {metric.body_fat_pct ?? "-"}% · 골격근량{" "}
              {metric.skeletal_muscle_kg ?? "-"}kg · 지방량 {metric.fat_mass_kg ?? "-"}kg
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              내장지방 {metric.visceral_fat_level ?? "-"} · InBody {metric.inbody_score ?? "-"}
            </p>
            {metric.notes ? (
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {metric.notes}
              </p>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
