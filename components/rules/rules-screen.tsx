import type { TableRow } from "@/lib/types/database";

type RulesScreenProps = {
  rules: TableRow<"recommendation_rules">[];
};

export function RulesScreen({ rules }: RulesScreenProps) {
  return (
    <main className="space-y-5 pb-24">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Rules</p>
        <div>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--foreground)]">추천 규칙</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">rule-based engine source of truth를 읽기 전용으로 먼저 노출합니다.</p>
        </div>
      </section>
      <section className="space-y-3">
        {rules.length === 0 ? <section className="rounded-[30px] border border-[var(--line)] bg-[var(--surface)] p-5"><p className="text-sm text-[var(--muted)]">등록된 recommendation rule이 없습니다.</p></section> : null}
        {rules.map((rule) => (
          <article key={rule.id} className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">{rule.name}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{rule.rule_type} · priority {rule.priority}</p>
              </div>
              <span className="rounded-full bg-[rgba(159,90,47,0.1)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">{rule.active ? "active" : "inactive"}</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-[20px] bg-[var(--surface-strong)] p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">conditions</p>
                <pre className="mt-2 overflow-x-auto text-xs text-[var(--foreground)]">{JSON.stringify(rule.conditions_json, null, 2)}</pre>
              </div>
              <div className="rounded-[20px] bg-[var(--surface-strong)] p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">actions</p>
                <pre className="mt-2 overflow-x-auto text-xs text-[var(--foreground)]">{JSON.stringify(rule.actions_json, null, 2)}</pre>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
