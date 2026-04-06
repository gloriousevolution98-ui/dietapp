# CODEX_FIRST_PROMPT

아래 내용을 Codex에 첫 작업으로 그대로 붙여넣을 수 있다.

---

이 저장소를 `Body OS`라는 개인화 다이어트/운동 코치 앱으로 초기화해줘.

반드시 아래 문서를 먼저 읽고 반영해:
- `PRD.md`
- `SCHEMA.md`
- `SCREENS.md`
- `RULE_ENGINE.md`
- `AGENTS.md`

구현 조건:
- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase 연동 구조
- 모바일 우선 UI
- 하단 탭 네비게이션
- 아래 라우트 생성:
  - /
  - /today
  - /meals
  - /training
  - /cardio
  - /body
  - /goals
  - /rules
  - /import
  - /settings
- strict typing 유지
- placeholder가 아니라 실제 앱 구조를 만들 것
- domain logic는 `lib/domain` 아래에 분리할 것
- types는 `lib/types` 아래에 정리할 것
- 공통 컴포넌트는 `components` 아래에 둘 것

이번 단계에서 꼭 해줘야 하는 것:
1. 프로젝트 scaffold
2. app layout + mobile nav
3. Supabase client/server setup
4. import page skeleton
5. dashboard placeholder cards
6. training/meals/cardio/body/goals/rules 기본 page shell
7. lint/typecheck가 통과하도록 정리

중요한 제품 개념:
- 단순 기록 앱이 아님
- 오늘 day type과 추천이 핵심
- 상체 우선 / 하체 유지 / 교정 루틴 포함
- 천국의 계단 quick logging 필요
- 점진적 과부하 엔진이 뒤에 붙을 예정
- legacy aggregate log import를 지원해야 함

작업 후에는:
- 생성/수정한 파일 목록
- 남은 TODO
- 다음에 Codex에 줄 만한 작업 제안
을 정리해줘.
