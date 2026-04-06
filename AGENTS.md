# AGENTS.md

## 프로젝트 성격

이 저장소는 **개인화 다이어트/운동 코치 앱**이다.  
핵심은 단순 기록이 아니라 **추천 규칙 + 점진적 과부하 + 복귀 시스템**이다.

## 우선순위

1. 데이터 모델을 먼저 맞춘다.
2. import가 가능한 구조를 만든다.
3. 입력 UX를 모바일 우선으로 만든다.
4. 추천 엔진은 rule-based로 시작한다.
5. 세트별 로그를 기준 모델로 하되, legacy aggregate import도 수용한다.
6. 상체 우선 / 하체 유지 / 교정 루틴이 제품 설계에 살아 있어야 한다.

## 기술 원칙

- TypeScript strict mode 유지
- any 남발 금지
- zod로 폼/입력 검증
- 서버와 클라이언트 경계 명확히
- DB enum과 앱 enum 동기화
- 복잡한 비즈니스 로직은 `lib/domain/*`에 분리
- UI에서 계산하지 말고 domain/service에서 계산

## UI 원칙

- 모바일 우선
- 한 손 입력 최적화
- 오늘 해야 할 행동이 바로 보여야 함
- 자주 쓰는 입력은 one-tap 또는 최소 tap
- 숫자 입력은 키패드 친화적으로
- 차트는 최소한만

## 데이터 원칙

- 삭제보다 soft delete 우선
- imported legacy data와 new app data를 구분할 것
- 매크로가 비어 있는 음식은 누락 상태를 명시할 것
- 날짜/시간은 일관성 있게 저장
- 계산 가능한 총합은 DB나 service layer에서 재계산 가능해야 함

## 운동 로직 원칙

- 점진적 과부하는 double progression 기본
- 증량 조건은 명시적이어야 함
- 허리 과신전 / 오리궁뎅이 관련 corrective는 별도 루틴으로 추적
- 하체 볼륨은 유지 목적
- 천국의 계단은 기본 유산소 preset을 제공

## 추천 엔진 원칙

- black box AI 추론에 의존하지 않는다.
- 규칙은 읽기 쉬운 JSON/TS 객체로 보관한다.
- 어떤 추천이 왜 나왔는지 trace 가능해야 한다.
- recommendation snapshot을 저장해 나중에 복기 가능하게 한다.

## 구현 순서

1. schema / migration
2. auth / layout / nav
3. import
4. master CRUD
5. logging
6. dashboard
7. rule engine
8. progressive overload
9. polish

## 코딩 지침

- 파일 수정은 작고 검증 가능하게
- 먼저 읽고, 그 다음 수정
- 신규 기능은 route + domain + validation + UI를 한 덩어리로 완성
- TODO 주석 남발 금지
- lint/typecheck 통과 상태 유지
- 테스트 가능한 순수 함수는 unit test 추가

## 예상 명령어

프로젝트가 scaffold된 후 아래 명령을 기준으로 맞춘다.

- install: `pnpm install`
- dev: `pnpm dev`
- lint: `pnpm lint`
- typecheck: `pnpm typecheck`
- test: `pnpm test`
- db generate/migrate: `pnpm db:migrate`
- seed: `pnpm db:seed`

## 첫 단계에서 Codex가 해야 할 것

- Next.js + Supabase + Tailwind scaffold
- auth/session 기본 연결
- 하단 nav 포함 mobile layout
- `supabase_schema.sql` 또는 migration 반영
- import page skeleton
