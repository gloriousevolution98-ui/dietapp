"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SaveProfileResult } from "@/app/(app)/settings/actions";
import { profileDraftSchema, type ProfileDraft } from "@/lib/schema/profile";

type ProfileSettingsScreenProps = {
  initialValue: ProfileDraft;
  saveProfile: (draft: ProfileDraft) => Promise<SaveProfileResult>;
};

export function ProfileSettingsScreen({ initialValue, saveProfile }: ProfileSettingsScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    const parsed = profileDraftSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인하세요.");
      setMessage(null);
      return;
    }
    setIsSaving(true);
    const result = await saveProfile(parsed.data);
    setIsSaving(false);
    if (!result.success) {
      setError(result.error);
      setMessage(null);
      return;
    }
    setError(null);
    setMessage("기본 설정을 저장했습니다.");
    router.refresh();
  }

  function setNumberField<K extends keyof ProfileDraft>(key: K, value: string) {
    setDraft((current) => ({
      ...current,
      [key]: value === "" ? undefined : Number(value),
    }));
  }

  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Settings</p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">기본 설정</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">단백질 목표, 기본 밥 범위, 메인 유산소, 기본 분할을 저장합니다.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Display Name</span><input value={draft.display_name ?? ""} onChange={(e)=>setDraft((c)=>({...c,display_name:e.target.value || undefined}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Height</span><input inputMode="decimal" value={draft.height_cm ?? ""} onChange={(e)=>setNumberField("height_cm", e.target.value)} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Protein Target</span><input inputMode="numeric" value={draft.protein_target_g} onChange={(e)=>setDraft((c)=>({...c,protein_target_g:Number(e.target.value || 0)}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Current Weight</span><input inputMode="decimal" value={draft.current_weight_kg ?? ""} onChange={(e)=>setNumberField("current_weight_kg", e.target.value)} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Goal Weight</span><input inputMode="decimal" value={draft.goal_weight_kg ?? ""} onChange={(e)=>setNumberField("goal_weight_kg", e.target.value)} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="col-span-2 space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Main Cardio</span><input value={draft.main_cardio ?? ""} onChange={(e)=>setDraft((c)=>({...c,main_cardio:e.target.value || undefined}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="col-span-2 space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Primary Split</span><input value={draft.primary_split ?? ""} onChange={(e)=>setDraft((c)=>({...c,primary_split:e.target.value || undefined}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Lunch Min</span><input inputMode="numeric" value={draft.default_lunch_rice_g_min} onChange={(e)=>setDraft((c)=>({...c,default_lunch_rice_g_min:Number(e.target.value || 0)}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Lunch Max</span><input inputMode="numeric" value={draft.default_lunch_rice_g_max} onChange={(e)=>setDraft((c)=>({...c,default_lunch_rice_g_max:Number(e.target.value || 0)}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Dinner Min</span><input inputMode="numeric" value={draft.default_dinner_rice_g_min} onChange={(e)=>setDraft((c)=>({...c,default_dinner_rice_g_min:Number(e.target.value || 0)}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
          <label className="space-y-2"><span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Dinner Max</span><input inputMode="numeric" value={draft.default_dinner_rice_g_max} onChange={(e)=>setDraft((c)=>({...c,default_dinner_rice_g_max:Number(e.target.value || 0)}))} className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3" /></label>
        </div>
        {error ? <p className="mt-4 text-sm text-[#9b2c2c]">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-[var(--success)]">{message}</p> : null}
        <button type="button" onClick={handleSave} disabled={isSaving} className="mt-5 w-full rounded-[22px] bg-[var(--foreground)] px-4 py-4 text-base font-semibold text-white">{isSaving ? "저장 중..." : "기본 설정 저장"}</button>
      </section>
    </main>
  );
}
