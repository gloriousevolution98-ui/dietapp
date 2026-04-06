"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FoodImportResult, ImportSummary } from "@/app/(app)/import/actions";
import { cn } from "@/lib/utils/cn";

type ImportWizardScreenProps = {
  importFoodMaster: (formData: FormData) => Promise<FoodImportResult>;
};

const steps = [
  "Food Master",
  "Exercise Master",
  "Meal Log",
  "Strength Log",
  "Cardio Log",
  "Goal / Rule",
  "결과 검토",
] as const;

export function ImportWizardScreen({
  importFoodMaster,
}: ImportWizardScreenProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeStep, setActiveStep] = useState<(typeof steps)[number]>("Food Master");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  async function handleFoodImport() {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setError("업로드할 CSV 파일을 선택하세요.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    setIsUploading(true);
    const result = await importFoodMaster(formData);
    setIsUploading(false);

    if (!result.success) {
      setError(result.error);
      setSummary(null);
      return;
    }

    setError(null);
    setSummary(result.summary);
    setActiveStep("결과 검토");
    router.refresh();
  }

  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          Import
        </p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">
            CSV Import Wizard
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Notion export를 앱 스키마로 옮기기 위한 단계형 import입니다. 이번 단계에서는 Food Master만 실제 업로드가 동작합니다.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_16px_40px_rgba(71,55,38,0.08)]">
        <div className="grid grid-cols-2 gap-2">
          {steps.map((step) => {
            const enabled = step === "Food Master" || step === "결과 검토";
            return (
              <button
                key={step}
                type="button"
                disabled={!enabled}
                onClick={() => enabled && setActiveStep(step)}
                className={cn(
                  "rounded-[18px] px-3 py-3 text-left text-sm font-medium transition",
                  activeStep === step
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-strong)] text-[var(--muted)]",
                  !enabled && "opacity-50",
                )}
              >
                {step}
              </button>
            );
          })}
        </div>
      </section>

      {activeStep === "Food Master" ? (
        <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Step 1
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
                Food Master 업로드
              </h2>
            </div>
            <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">
              CSV only
            </span>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-[24px] bg-[var(--surface-strong)] p-4">
              <p className="text-sm font-medium text-[var(--foreground)]">
                지원 컬럼
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                `음식명`, `음식군`, `기준량`, `기준 단위`, `칼로리`, `탄수화물`,
                `단백질`, `지방`, `메모`
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                영문 컬럼명 `name`, `food_group`, `base_quantity`, `base_unit`, `kcal`, `carbs_g`, `protein_g`, `fat_g`, `notes`도 허용합니다.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                CSV File
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="w-full rounded-[18px] border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-3"
              />
            </label>

            {error ? <p className="text-sm text-[#9b2c2c]">{error}</p> : null}

            <button
              type="button"
              onClick={handleFoodImport}
              disabled={isUploading}
              className="w-full rounded-[22px] bg-[var(--foreground)] px-4 py-4 text-base font-semibold text-white"
            >
              {isUploading ? "업로드 중..." : "Food Master 가져오기"}
            </button>
          </div>
        </section>
      ) : null}

      {activeStep !== "Food Master" && activeStep !== "결과 검토" ? (
        <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="text-sm leading-6 text-[var(--muted)]">
            `{activeStep}` 단계는 다음 작업으로 이어서 구현합니다. 현재는 Food Master import 파이프라인만 실제 동작합니다.
          </p>
        </section>
      ) : null}

      {activeStep === "결과 검토" ? (
        <section className="space-y-4">
          <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Import Summary
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[22px] bg-[var(--surface-strong)] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  Success
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {summary?.successCount ?? 0}
                </p>
              </div>
              <div className="rounded-[22px] bg-[var(--surface-strong)] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  Failure
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {summary?.failureCount ?? 0}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Macro Missing
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(summary?.missingMacroRows ?? []).length > 0 ? (
                summary?.missingMacroRows.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-[rgba(159,90,47,0.12)] bg-[var(--surface-strong)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  누락 매크로 항목 없음
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Row Errors
            </p>
            <div className="mt-4 space-y-2">
              {(summary?.errors ?? []).length > 0 ? (
                summary?.errors.map((item) => (
                  <div
                    key={`${item.rowNumber}-${item.reason}`}
                    className="rounded-[20px] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)]"
                  >
                    row {item.rowNumber}: {item.reason}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  에러 row 없음
                </p>
              )}
            </div>
          </section>
        </section>
      ) : null}
    </main>
  );
}
