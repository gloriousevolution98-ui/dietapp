"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SaveProgramResult } from "@/app/(app)/program/actions";
import type { TableRow } from "@/lib/types/database";
import {
  workoutProgramDayDraftSchema,
  workoutProgramDraftSchema,
  type WorkoutProgramDayDraft,
  type WorkoutProgramDraft,
} from "@/lib/schema/workout";

type ProgramScreenProps = {
  programs: TableRow<"workout_programs">[];
  activeProgram: TableRow<"workout_programs"> | null;
  days: TableRow<"workout_program_days">[];
  saveProgram: (draft: WorkoutProgramDraft) => Promise<SaveProgramResult>;
  saveProgramDay: (
    draft: WorkoutProgramDayDraft,
  ) => Promise<SaveProgramResult>;
};

const emptyProgramDraft: WorkoutProgramDraft = {
  name: "",
  description: undefined,
  focus: "upper_priority_cut",
  cycle_mode: "rolling",
  is_active: true,
};

export function ProgramScreen({
  programs,
  activeProgram,
  days,
  saveProgram,
  saveProgramDay,
}: ProgramScreenProps) {
  const router = useRouter();
  const [programDraft, setProgramDraft] =
    useState<WorkoutProgramDraft>(emptyProgramDraft);
  const [dayDraft, setDayDraft] = useState<WorkoutProgramDayDraft>({
    program_id: activeProgram?.id ?? "",
    day_order: (days.at(-1)?.day_order ?? 0) + 1,
    name: "",
    focus: undefined,
    notes: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveProgram() {
    const parsed = workoutProgramDraftSchema.safeParse(programDraft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "프로그램 입력값을 확인하세요.");
      setMessage(null);
      return;
    }
    setIsSaving(true);
    const result = await saveProgram(parsed.data);
    setIsSaving(false);
    if (!result.success) {
      setError(result.error);
      setMessage(null);
      return;
    }
    setProgramDraft(emptyProgramDraft);
    setError(null);
    setMessage("프로그램을 저장했습니다.");
    router.refresh();
  }

  async function handleSaveDay() {
    const parsed = workoutProgramDayDraftSchema.safeParse({
      ...dayDraft,
      program_id: activeProgram?.id ?? "",
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "program day 입력값을 확인하세요.");
      setMessage(null);
      return;
    }
    setIsSaving(true);
    const result = await saveProgramDay(parsed.data);
    setIsSaving(false);
    if (!result.success) {
      setError(result.error);
      setMessage(null);
      return;
    }
    setDayDraft({
      program_id: activeProgram?.id ?? "",
      day_order: (days.at(-1)?.day_order ?? 0) + 2,
      name: "",
      focus: undefined,
      notes: undefined,
    });
    setError(null);
    setMessage("program day를 저장했습니다.");
    router.refresh();
  }

  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Program</p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">
            루틴 템플릿
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            active program과 day split을 먼저 정의해두면 training과 today에서 공통으로 읽을 수 있습니다.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Active Program</p>
        {activeProgram ? (
          <div className="mt-4 rounded-[24px] bg-[var(--surface-strong)] p-4">
            <h2 className="text-xl font-semibold tracking-[-0.04em]">{activeProgram.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {activeProgram.focus ?? "focus 미지정"} · {activeProgram.cycle_mode ?? "rolling"}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">active program이 없습니다.</p>
        )}
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Add Program</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="col-span-2 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Name</span>
            <input value={programDraft.name} onChange={(e)=>setProgramDraft((c)=>({...c,name:e.target.value}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" />
          </label>
          <label className="col-span-2 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Focus</span>
            <input value={programDraft.focus ?? ""} onChange={(e)=>setProgramDraft((c)=>({...c,focus:e.target.value || undefined}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" />
          </label>
          <label className="col-span-2 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Description</span>
            <textarea rows={3} value={programDraft.description ?? ""} onChange={(e)=>setProgramDraft((c)=>({...c,description:e.target.value || undefined}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" />
          </label>
        </div>
        {error ? <p className="mt-4 text-sm text-[#9b2c2c]">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-[var(--success)]">{message}</p> : null}
        <button type="button" onClick={handleSaveProgram} disabled={isSaving} className="mt-5 w-full rounded-[22px] bg-[var(--foreground)] px-4 py-4 text-base font-semibold text-white">
          {isSaving ? "저장 중..." : "Program 저장"}
        </button>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Program Days</p>
        <div className="mt-4 space-y-3">
          {days.map((day) => (
            <div key={day.id} className="rounded-[22px] bg-[var(--surface-strong)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">{day.day_order}. {day.name}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{day.focus ?? "focus 미지정"}</p>
            </div>
          ))}
          {days.length === 0 ? <p className="text-sm text-[var(--muted)]">등록된 day split이 없습니다.</p> : null}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Order</span>
            <input inputMode="numeric" value={dayDraft.day_order} onChange={(e)=>setDayDraft((c)=>({...c,day_order:Number(e.target.value || 0)}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Name</span>
            <input value={dayDraft.name} onChange={(e)=>setDayDraft((c)=>({...c,name:e.target.value}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" />
          </label>
          <label className="col-span-2 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Focus</span>
            <input value={dayDraft.focus ?? ""} onChange={(e)=>setDayDraft((c)=>({...c,focus:e.target.value || undefined}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" />
          </label>
        </div>
        <button type="button" onClick={handleSaveDay} disabled={isSaving || !activeProgram} className="mt-5 w-full rounded-[22px] bg-[var(--accent)] px-4 py-4 text-base font-semibold text-white disabled:opacity-50">
          {isSaving ? "저장 중..." : "Program Day 저장"}
        </button>
      </section>
    </main>
  );
}
