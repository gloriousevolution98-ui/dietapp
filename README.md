# Body OS — Codex 실행용 기획 번들

이 폴더는 **변상원 개인화 다이어트/운동 시스템**을 앱으로 옮기기 위한 Codex 친화형 문서 세트다.

## 포함 파일

- `README.md` — 전체 안내
- `DATA_AUDIT.md` — 현재 Notion export 구조와 데이터 감사 결과
- `PRD.md` — 제품 요구사항 문서
- `SCHEMA.md` — DB 스키마 설명
- `SCREENS.md` — 화면/라우트/컴포넌트 명세
- `RULE_ENGINE.md` — 추천 규칙, 회복 규칙, 점진적 과부하 규칙
- `AGENTS.md` — Codex 작업 지침
- `CODEX_TASKS.md` — 순차 구현 태스크
- `supabase_schema.sql` — 초기 Supabase/Postgres 스키마

## 권장 구현 스택

- Frontend: Next.js (App Router) + TypeScript
- Backend: Supabase (Postgres/Auth/Storage)
- UI: Tailwind + shadcn/ui
- Validation: Zod
- Chart: Recharts 또는 유사 라이브러리

## 핵심 제품 방향

이 앱은 단순 칼로리 앱이 아니다. 아래를 동시에 다룬다.

1. **식사 기록**
2. **근력/유산소 기록**
3. **주간 목표 추적**
4. **약속 있는 날/과식 다음 날 복귀 가이드**
5. **상체 우선 점진적 과부하**
6. **오리궁뎅이/골반 전방경사 보완 루틴**
7. **데이터 기반 개인화 추천**

## 권장 시작 순서

1. `PRD.md` 읽기
2. `DATA_AUDIT.md`로 현재 CSV 구조 이해
3. `SCHEMA.md`와 `supabase_schema.sql`로 DB 생성
4. `AGENTS.md`를 저장소 루트에 배치
5. `CODEX_TASKS.md` 1번부터 순서대로 Codex에 지시

## MVP 정의

MVP는 아래까지만 완성해도 충분히 usable 하다.

- Food Master / Exercise Master import
- Meal / Strength / Cardio 기록 입력
- 오늘 화면과 대시보드
- 체중/허리 추적
- 추천 규칙 기반 하루 가이드
- 점진적 과부하 제안
- 천국의 계단 기록 및 주간 횟수 요약

## 주의

현재 Notion export에는 메인 페이지에서 언급된 `InBody Log` CSV가 포함되어 있지 않다.  
그래서 body metrics 화면은 **수동 입력** 기준으로 먼저 구현하고, 나중에 CSV import를 추가하는 것이 맞다.
