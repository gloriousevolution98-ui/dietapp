"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SaveCardioLogResult } from "@/app/(app)/cardio/actions";
import { cardioIntensities } from "@/lib/types/enums";
import { cardioLogDraftSchema, type CardioLogDraft } from "@/lib/schema/logs";
import type { TableRow } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

type CardioLogScreenProps = {
  initialLogs: TableRow<"cardio_logs">[];
  weeklySessions: number;
  weeklyMinutes: number;
  saveCardio: (draft: CardioLogDraft) => Promise<SaveCardioLogResult>;
};

const presetDraft = (): CardioLogDraft => ({
  performed_at: new Date().toISOString(),
  duration_min: 30,
  level: 5,
  calories_kcal: undefined,
  intensity: "moderate",
  notes: undefined,
});

function formatPerformedAt(value: string | null) {
  if (!value) {
    return "시간 미입력";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

export function CardioLogScreen({
  initialLogs,
  weeklySessions,
  weeklyMinutes,
  saveCardio,
}: CardioLogScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<CardioLogDraft>(presetDraft);
  const [logs, setLogs] = useState(initialLogs);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    const parsed = cardioLogDraftSchema.safeParse(draft);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인하세요.");
      setMessage(null);
      return;
    }

    setIsSaving(true);
    const result = await saveCardio(parsed.data);
    setIsSaving(false);

    if (!result.success) {
      setError(result.error);
      setMessage(null);
      return;
    }

    setLogs((current) => [
      {
        id: crypto.randomUUID(),
        user_id: "",
        workout_session_id: null,
        exercise_item_id: null,
        performed_at: parsed.data.performed_at ?? null,
        duration_min: parsed.data.duration_min,
        level: parsed.data.level ?? null,
        distance_km: null,
        calories_kcal: parsed.data.calories_kcal ?? null,
        avg_hr: null,
        intensity: parsed.data.intensity ?? null,
        notes: parsed.data.notes ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ...current,
    ]);
    setDraft(presetDraft());
    setError(null);
    setMessage("유산소 기록을 저장했습니다.");
    router.refresh();
  }

  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Cardio
        </p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">
            유산소 기록
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            천국의 계단 preset으로 10초 안에 기록하고, 이번 주 횟수와 총 시간을 바로 확인합니다.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[rgba(86,64,45,0.12)] bg-[linear-gradient(145deg,rgba(125,69,31,0.98),rgba(87,48,20,0.96))] p-5 text-white shadow-[0_24px_60px_rgba(78,48,23,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(255,232,209,0.78)]">
              Stairmaster Preset
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
              Level 5 · 30분
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setDraft(presetDraft())}
            className="rounded-[20px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3 text-sm font-medium"
          >
            preset reset
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[rgba(255,232,209,0.72)]">
              이번 주 횟수
            </p>
            <p className="mt-2 text-2xl font-semibold">{weeklySessions}</p>
          </div>
          <div className="rounded-[22px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[rgba(255,232,209,0.72)]">
              총 시간
            </p>
            <p className="mt-2 text-2xl font-semibold">{weeklyMinutes}분</p>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(71,55,38,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Quick Log
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Level
            </span>
            <input
              inputMode="numeric"
              value={draft.level ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  level:
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Duration
            </span>
            <input
              inputMode="numeric"
              value={draft.duration_min}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  duration_min: Number(event.target.value || 0),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Calories
            </span>
            <input
              inputMode="numeric"
              value={draft.calories_kcal ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  calories_kcal:
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              placeholder="optional"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Intensity
            </span>
            <select
              value={draft.intensity ?? "moderate"}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  intensity: event.target.value as CardioLogDraft["intensity"],
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            >
              {cardioIntensities.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
              placeholder="심박, 체감 강도, 컨디션 메모"
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
          {isSaving ? "저장 중..." : "천국의 계단 기록 저장"}
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Recent Logs
          </p>
          <p className="text-sm text-[var(--muted)]">{logs.length} records</p>
        </div>
        {logs.map((log) => (
          <article
            key={log.id}
            className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  천국의 계단
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {formatPerformedAt(log.performed_at)}
                </p>
              </div>
              <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">
                {log.intensity ?? "moderate"}
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              레벨 {log.level ?? "-"} · {log.duration_min}분
              {log.calories_kcal ? ` · ${Math.round(log.calories_kcal)} kcal` : ""}
            </p>
            {log.notes ? (
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {log.notes}
              </p>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
