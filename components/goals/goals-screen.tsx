"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SaveGoalResult } from "@/app/(app)/goals/actions";
import { goalTypes } from "@/lib/types/enums";
import { goalPlanDraftSchema, type GoalPlanDraft } from "@/lib/schema/goal-plan";
import type { TableRow } from "@/lib/types/database";

type GoalsScreenProps = {
  goals: TableRow<"goal_plans">[];
  saveGoal: (draft: GoalPlanDraft) => Promise<SaveGoalResult>;
};

const emptyDraft: GoalPlanDraft = {
  name: "",
  goal_type: "cut",
  start_date: new Date().toISOString().slice(0, 10),
  end_date: undefined,
  target_weight_kg: undefined,
  activity_level: undefined,
  constitution_type: undefined,
  training_focus: undefined,
  protein_target_g: undefined,
  is_active: true,
  notes: undefined,
};

export function GoalsScreen({ goals, saveGoal }: GoalsScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<GoalPlanDraft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    const parsed = goalPlanDraftSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인하세요.");
      setMessage(null);
      return;
    }
    setIsSaving(true);
    const result = await saveGoal(parsed.data);
    setIsSaving(false);
    if (!result.success) {
      setError(result.error);
      setMessage(null);
      return;
    }
    setDraft(emptyDraft);
    setError(null);
    setMessage("목표를 저장했습니다.");
    router.refresh();
  }

  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Goals</p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">목표 플랜</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">현재 감량/유지 계획을 저장합니다.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Name</span><input value={draft.name} onChange={(e)=>setDraft((c)=>({...c,name:e.target.value}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Goal Type</span><select value={draft.goal_type} onChange={(e)=>setDraft((c)=>({...c,goal_type:e.target.value as GoalPlanDraft["goal_type"]}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3">{goalTypes.map((type)=><option key={type} value={type}>{type}</option>)}</select></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Start Date</span><input type="date" value={draft.start_date} onChange={(e)=>setDraft((c)=>({...c,start_date:e.target.value}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">End Date</span><input type="date" value={draft.end_date ?? ""} onChange={(e)=>setDraft((c)=>({...c,end_date:e.target.value || undefined}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Target Weight</span><input inputMode="decimal" value={draft.target_weight_kg ?? ""} onChange={(e)=>setDraft((c)=>({...c,target_weight_kg:e.target.value===""?undefined:Number(e.target.value)}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Protein Target</span><input inputMode="numeric" value={draft.protein_target_g ?? ""} onChange={(e)=>setDraft((c)=>({...c,protein_target_g:e.target.value===""?undefined:Number(e.target.value)}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
        </div>
        {error ? <p className="mt-4 text-sm text-[#9b2c2c]">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-[var(--success)]">{message}</p> : null}
        <button type="button" onClick={handleSave} disabled={isSaving} className="mt-5 w-full rounded-[22px] bg-[var(--foreground)] px-4 py-4 text-base font-semibold text-white">{isSaving ? "저장 중..." : "목표 저장"}</button>
      </section>

      <section className="space-y-3">
        {goals.map((goal) => (
          <article key={goal.id} className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">{goal.name}</h2>
              <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">{goal.is_active ? "active" : goal.goal_type}</span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{goal.start_date}{goal.end_date ? ` to ${goal.end_date}` : ""}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
