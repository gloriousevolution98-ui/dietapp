"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SaveDailyCheckinResult } from "@/app/(app)/today/actions";
import { dailyCheckinDraftSchema, type DailyCheckinDraft } from "@/lib/schema/logs";
import { cn } from "@/lib/utils/cn";

type CheckinFormProps = {
  initialValue: DailyCheckinDraft;
  saveCheckin: (draft: DailyCheckinDraft) => Promise<SaveDailyCheckinResult>;
};

const scoreOptions = [1, 2, 3, 4, 5] as const;

const quickActions = [
  { href: "/meals", label: "점심 추가" },
  { href: "/meals", label: "간식 추가" },
  { href: "/meals", label: "저녁 추가" },
  { href: "/training", label: "운동 시작" },
  { href: "/cardio", label: "천국의 계단" },
  { href: "/body", label: "체중 입력" },
] as const;

type ScoreSelectorProps = {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
};

function ScoreSelector({ label, value, onChange }: ScoreSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <div className="grid grid-cols-5 gap-2">
        {scoreOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-[18px] px-3 py-3 text-sm font-semibold transition",
              value === option
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-strong)] text-[var(--foreground)]",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CheckinForm({ initialValue, saveCheckin }: CheckinFormProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<DailyCheckinDraft>(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    const parsed = dailyCheckinDraftSchema.safeParse(draft);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인하세요.");
      setMessage(null);
      return;
    }

    setIsSaving(true);
    const result = await saveCheckin(parsed.data);
    setIsSaving(false);

    if (!result.success) {
      setError(result.error);
      setMessage(null);
      return;
    }

    setError(null);
    setMessage("오늘 체크인을 저장했습니다.");
    router.refresh();
  }

  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Today
        </p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">
            오늘 실행
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            오늘 컨디션과 약속, 운동 여부를 먼저 저장하면 대시보드 day type과 alert가 바로 바뀝니다.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[rgba(86,64,45,0.12)] bg-[linear-gradient(145deg,rgba(125,69,31,0.98),rgba(87,48,20,0.96))] p-5 text-white shadow-[0_24px_60px_rgba(78,48,23,0.24)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(255,232,209,0.78)]">
          Quick Actions
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-[22px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-4 text-sm font-medium text-[rgba(255,248,240,0.92)]"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(71,55,38,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Daily Check-in
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
              오늘 상태 입력
            </h2>
          </div>
          <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">
            {draft.date}
          </span>
        </div>

        <div className="mt-5 space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              약속 수
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      appointments_count: count,
                    }))
                  }
                  className={cn(
                    "rounded-[18px] px-3 py-3 text-sm font-semibold transition",
                    draft.appointments_count === count
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--surface-strong)] text-[var(--foreground)]",
                  )}
                >
                  {count === 2 ? "2+" : count}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  trained_today: !current.trained_today,
                }))
              }
              className={cn(
                "rounded-[22px] px-4 py-4 text-left transition",
                draft.trained_today
                  ? "bg-[var(--success)] text-white"
                  : "bg-[var(--surface-strong)] text-[var(--foreground)]",
              )}
            >
              <p className="text-xs uppercase tracking-[0.18em] opacity-80">Training</p>
              <p className="mt-2 text-base font-semibold">
                {draft.trained_today ? "오늘 운동함" : "오늘 운동 안 함"}
              </p>
            </button>
            <button
              type="button"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  prev_day_overeat: !current.prev_day_overeat,
                }))
              }
              className={cn(
                "rounded-[22px] px-4 py-4 text-left transition",
                draft.prev_day_overeat
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface-strong)] text-[var(--foreground)]",
              )}
            >
              <p className="text-xs uppercase tracking-[0.18em] opacity-80">Recovery</p>
              <p className="mt-2 text-base font-semibold">
                {draft.prev_day_overeat ? "전날 과식 있음" : "전날 과식 없음"}
              </p>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                수면 시간
              </span>
              <input
                inputMode="decimal"
                value={draft.sleep_hours ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    sleep_hours:
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                  }))
                }
                className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
                placeholder="예: 6.5"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                걸음 수
              </span>
              <input
                inputMode="numeric"
                value={draft.steps ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    steps:
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                  }))
                }
                className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
                placeholder="예: 8000"
              />
            </label>
          </div>

          <ScoreSelector
            label="Stress"
            value={draft.stress_score}
            onChange={(value) =>
              setDraft((current) => ({ ...current, stress_score: value }))
            }
          />
          <ScoreSelector
            label="Hunger"
            value={draft.hunger_score}
            onChange={(value) =>
              setDraft((current) => ({ ...current, hunger_score: value }))
            }
          />
          <ScoreSelector
            label="Digestive"
            value={draft.digestive_score}
            onChange={(value) =>
              setDraft((current) => ({ ...current, digestive_score: value }))
            }
          />
          <ScoreSelector
            label="Lower Body Fatigue"
            value={draft.lower_body_fatigue_score}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                lower_body_fatigue_score: value,
              }))
            }
          />

          <label className="block space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Notes
            </span>
            <textarea
              rows={4}
              value={draft.notes ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  notes: event.target.value || undefined,
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              placeholder="예: 저녁 약속 있음, 허리 뻐근함, 운동은 등 day 예정"
            />
          </label>

          {error ? <p className="text-sm text-[#9b2c2c]">{error}</p> : null}
          {message ? <p className="text-sm text-[var(--success)]">{message}</p> : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-[22px] bg-[var(--foreground)] px-4 py-4 text-base font-semibold text-white"
          >
            {isSaving ? "저장 중..." : "오늘 체크인 저장"}
          </button>
        </div>
      </section>
    </main>
  );
}
