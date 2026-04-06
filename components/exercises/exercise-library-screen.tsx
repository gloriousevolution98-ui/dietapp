"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SaveExerciseItemResult } from "@/app/(app)/library/exercises/actions";
import { exerciseScopes, exerciseTypes, measurementModes } from "@/lib/types/enums";
import {
  exerciseItemDraftSchema,
  type ExerciseItemDraft,
} from "@/lib/schema/exercise";
import type { TableRow } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

type ExerciseLibraryScreenProps = {
  exercises: TableRow<"exercise_items">[];
  saveExercise: (draft: ExerciseItemDraft) => Promise<SaveExerciseItemResult>;
  toggleActive: (input: {
    id: string;
    isActive: boolean;
  }) => Promise<SaveExerciseItemResult>;
};

const emptyDraft: ExerciseItemDraft = {
  name: "",
  exercise_type: "strength",
  exercise_scope: "specific",
  body_part: undefined,
  equipment: undefined,
  measurement_mode: "weight_reps_sets",
  is_free_weight: false,
  default_rep_min: undefined,
  default_rep_max: undefined,
  default_rir: undefined,
  progression_step_kg: undefined,
  is_active: true,
  notes: undefined,
};

export function ExerciseLibraryScreen({
  exercises,
  saveExercise,
  toggleActive,
}: ExerciseLibraryScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<ExerciseItemDraft>(emptyDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSaveExercise() {
    const parsed = exerciseItemDraftSchema.safeParse(draft);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Exercise 입력값을 확인하세요.");
      setMessage(null);
      return;
    }

    setIsSaving(true);
    const result = await saveExercise(parsed.data);
    setIsSaving(false);

    if (!result.success) {
      setError(result.error);
      setMessage(null);
      return;
    }

    setDraft(emptyDraft);
    setError(null);
    setMessage("Exercise Master에 저장했습니다.");
    router.refresh();
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    const result = await toggleActive({ id, isActive });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setError(null);
    router.refresh();
  }

  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Exercise Library
        </p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">
            Exercise Master
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            운동 타입, scope, 측정 기준을 먼저 정리해두면 training과 program에서 같은 기준으로 재사용할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[rgba(86,64,45,0.12)] bg-[linear-gradient(145deg,rgba(125,69,31,0.98),rgba(87,48,20,0.96))] p-5 text-white shadow-[0_24px_60px_rgba(78,48,23,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(255,232,209,0.78)]">
              Quick Link
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
              Training으로 돌아가기
            </h2>
          </div>
          <Link
            href="/training"
            className="rounded-[20px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3 text-sm font-medium"
          >
            /training
          </Link>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_16px_40px_rgba(71,55,38,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Add Exercise
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="col-span-2 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Name
            </span>
            <input
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              placeholder="예: 렛풀다운"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Type
            </span>
            <select
              value={draft.exercise_type}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  exercise_type: event.target.value as ExerciseItemDraft["exercise_type"],
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            >
              {exerciseTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Scope
            </span>
            <select
              value={draft.exercise_scope}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  exercise_scope: event.target.value as ExerciseItemDraft["exercise_scope"],
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            >
              {exerciseScopes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Body Part
            </span>
            <input
              value={draft.body_part ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  body_part: event.target.value || undefined,
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              placeholder="예: back"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Equipment
            </span>
            <input
              value={draft.equipment ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  equipment: event.target.value || undefined,
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              placeholder="예: cable"
            />
          </label>

          <label className="col-span-2 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Measurement Mode
            </span>
            <select
              value={draft.measurement_mode}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  measurement_mode: event.target.value as ExerciseItemDraft["measurement_mode"],
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            >
              {measurementModes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Rep Min
            </span>
            <input
              inputMode="numeric"
              value={draft.default_rep_min ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  default_rep_min:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Rep Max
            </span>
            <input
              inputMode="numeric"
              value={draft.default_rep_max ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  default_rep_max:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Default RIR
            </span>
            <input
              inputMode="numeric"
              value={draft.default_rir ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  default_rir:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Step KG
            </span>
            <input
              inputMode="decimal"
              value={draft.progression_step_kg ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  progression_step_kg:
                    event.target.value === "" ? undefined : Number(event.target.value),
                }))
              }
              className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
            />
          </label>

          <button
            type="button"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                is_free_weight: !current.is_free_weight,
              }))
            }
            className={cn(
              "rounded-[18px] px-4 py-3 text-sm font-semibold transition",
              draft.is_free_weight
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface-strong)] text-[var(--foreground)]",
            )}
          >
            {draft.is_free_weight ? "free weight" : "machine / bodyweight"}
          </button>

          <button
            type="button"
            onClick={() =>
              setDraft((current) => ({
                ...current,
                is_active: !current.is_active,
              }))
            }
            className={cn(
              "rounded-[18px] px-4 py-3 text-sm font-semibold transition",
              draft.is_active
                ? "bg-[var(--foreground)] text-white"
                : "bg-[var(--surface-strong)] text-[var(--foreground)]",
            )}
          >
            {draft.is_active ? "active" : "inactive"}
          </button>

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
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-[#9b2c2c]">{error}</p> : null}
        {message ? (
          <p className="mt-4 text-sm text-[var(--success)]">{message}</p>
        ) : null}

        <button
          type="button"
          onClick={handleSaveExercise}
          disabled={isSaving}
          className="mt-5 w-full rounded-[22px] bg-[var(--foreground)] px-4 py-4 text-base font-semibold text-white"
        >
          {isSaving ? "저장 중..." : "Exercise 저장"}
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Exercises
          </p>
          <p className="text-sm text-[var(--muted)]">{exercises.length} items</p>
        </div>
        {exercises.map((exercise) => (
          <article
            key={exercise.id}
            className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                    {exercise.name}
                  </h2>
                  <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                    {exercise.exercise_type}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {exercise.exercise_scope} · {exercise.measurement_mode}
                  {exercise.body_part ? ` · ${exercise.body_part}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleActive(exercise.id, exercise.is_active)}
                className={cn(
                  "rounded-full px-3 py-2 text-xs font-semibold",
                  exercise.is_active
                    ? "bg-[var(--success)] text-white"
                    : "bg-[var(--surface-strong)] text-[var(--muted)]",
                )}
              >
                {exercise.is_active ? "active" : "inactive"}
              </button>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              rep {exercise.default_rep_min ?? "-"}-{exercise.default_rep_max ?? "-"} ·
              RIR {exercise.default_rir ?? "-"} · step {exercise.progression_step_kg ?? "-"}kg
            </p>
            {exercise.notes ? (
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {exercise.notes}
              </p>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
