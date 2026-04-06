import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TrainingPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: programs } = await supabase
    .from("workout_programs")
    .select("*")
    .eq("user_id", user.id)
    .order("is_active", { ascending: false })
    .limit(5);

  const activeProgram = (programs ?? []).find((program) => program.is_active) ?? null;
  const { data: days } = activeProgram
    ? await supabase
        .from("workout_program_days")
        .select("*")
        .eq("program_id", activeProgram.id)
        .order("day_order", { ascending: true })
    : { data: [] };

  return (
    <main className="space-y-6">
      <PageHeader
        eyebrow="Training"
        title="운동 기록"
        description="세트 로그와 프로그램 화면은 이후 단계에서 연결합니다."
      />
      <section className="rounded-[28px] border border-[rgba(86,64,45,0.12)] bg-[linear-gradient(145deg,rgba(125,69,31,0.98),rgba(87,48,20,0.96))] p-5 text-white shadow-[0_24px_60px_rgba(78,48,23,0.24)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgba(255,232,209,0.78)]">
          Setup
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
          Exercise Master 먼저 채우기
        </h2>
        <p className="mt-3 text-sm leading-6 text-[rgba(255,241,228,0.84)]">
          training과 program 연결 전에 운동 마스터를 먼저 구성해야 세트 기준과 progression 설정을 재사용할 수 있습니다.
        </p>
        <Link
          href="/library/exercises"
          className="mt-4 inline-flex rounded-[20px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3 text-sm font-medium"
        >
          Exercise Master 열기
        </Link>
        <Link
          href="/program"
          className="mt-4 ml-3 inline-flex rounded-[20px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 py-3 text-sm font-medium"
        >
          Program 열기
        </Link>
      </section>
      <section className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Today Program
        </p>
        {activeProgram ? (
          <>
            <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              {activeProgram.name}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {activeProgram.focus ?? "focus 미지정"}
            </p>
            <div className="mt-4 space-y-3">
              {(days ?? []).map((day) => (
                <div key={day.id} className="rounded-[22px] bg-[var(--surface-strong)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {day.day_order}. {day.name}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {day.focus ?? "focus 미지정"}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">
            active program이 없습니다. 먼저 `/program`에서 루틴과 day split을 추가하세요.
          </p>
        )}
      </section>
      <section className="rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-sm text-[var(--muted)]">
          다음 단계에서 오늘 프로그램, 운동 목록, 세트 입력, 이전 기록 비교를 붙입니다.
        </p>
      </section>
    </main>
  );
}
