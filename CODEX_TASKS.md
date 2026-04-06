# CODEX_TASKS

아래는 Codex에 순서대로 넣기 좋은 작업 단위다.  
한 번에 전부 시키지 말고, **각 태스크 단위로 실행 → 결과 확인 → 다음 태스크 진행**이 좋다.

---

## Task 1 — 프로젝트 초기 스캐폴드

### 목표
Next.js + TypeScript + Tailwind + Supabase 기반의 모바일 우선 앱 초기 구조 생성.

### Codex 프롬프트
이 저장소를 개인화 다이어트/운동 코치 앱으로 초기화해줘.
다음 조건을 만족해:
- Next.js App Router + TypeScript
- Tailwind + shadcn/ui
- Supabase client/server 설정
- 모바일 우선 레이아웃
- 하단 탭 네비게이션
- 기본 라우트 생성: /, /today, /meals, /training, /cardio, /body, /goals, /rules, /import, /settings
- strict typing 유지
- lint/typecheck 가능한 상태로 만들어줘

### 완료 기준
- 로컬에서 앱 실행 가능
- 하단 nav 렌더링
- 빈 페이지라도 라우트가 전부 존재

---

## Task 2 — DB 스키마 반영

### 목표
`supabase_schema.sql`의 테이블/enum/view를 반영.

### Codex 프롬프트
프로젝트에 Supabase schema migration을 추가해줘.
첨부된 `supabase_schema.sql`을 기준으로 enum, table, index를 만들고,
앱 타입 정의도 생성 가능한 구조로 정리해줘.
RLS는 user_id 기준으로 설계하되 MVP에서는 개발 편의성을 해치지 않게 구성해줘.

### 완료 기준
- migration 생성
- DB apply 가능
- 타입 에러 없음

---

## Task 3 — Import Wizard

### 목표
현재 Notion export csv를 앱 DB로 가져오기.

### Codex 프롬프트
`/import` 페이지에 CSV import wizard를 구현해줘.
다음 순서를 지원해야 해:
1. Food Master
2. Exercise Master
3. Meal Log
4. Strength Log
5. Cardio Log
6. Goal Plan
7. Recommendation Rule

요구사항:
- CSV 컬럼 매핑 미리보기
- import 성공/실패 row 수 표시
- food macro 누락 항목 감지
- exercise generic/specific 구분 기본값 지정
- strength log는 aggregate import로 저장
- import 결과를 요약 카드로 보여줘

### 완료 기준
- 각 CSV 업로드 후 DB insert 가능
- 에러 row가 있으면 표시
- import 완료 후 summary가 보임

---

## Task 4 — Food / Exercise Master CRUD

### 목표
마스터 데이터 편집 가능하게 만들기.

### Codex 프롬프트
Food Master와 Exercise Master CRUD를 구현해줘.
모바일에서 빠르게 검색/추가/수정 가능해야 하고,
food는 기준량/단위/탄단지/칼로리를,
exercise는 type/scope/body part/measurement mode를 수정 가능하게 해줘.

### 완료 기준
- 목록/검색/상세/수정/생성 가능
- 저장 후 목록 반영

---

## Task 5 — Meal Logging

### 목표
식사 기록 기능 완성.

### Codex 프롬프트
`/meals`에 식사 기록 기능을 구현해줘.
요구사항:
- meal 생성 후 여러 food entry 추가 가능
- 자주 먹는 음식 one-tap 추가
- 오늘 단백질/탄수/칼로리 합계 표시
- context type 선택 가능
- custom food도 추가 가능
- recovery/appointment context와 연결 가능

### 완료 기준
- 한 끼에 2개 이상 음식 추가 가능
- 하루 합계가 보임
- 수정/삭제 가능

---

## Task 6 — Strength Logging + Program

### 목표
루틴 prescription과 세트 기록 연결.

### Codex 프롬프트
`/program`과 `/training`을 구현해줘.
요구사항:
- 프로그램/분할/day 생성
- 운동별 sets/rep range/RIR/progression step 저장
- 오늘 day에 맞는 운동 목록 렌더링
- 세트별 weight/reps/RIR 입력
- 이전 세션 기록 비교 카드 표시
- aggregate imported log도 history에 같이 보여주기

### 완료 기준
- 프로그램 생성 가능
- 세트 기록 가능
- 이전 기록 비교 가능

---

## Task 7 — Progressive Overload Engine

### 목표
증량 추천 계산.

### Codex 프롬프트
progressive overload 도메인 로직을 구현해줘.
기본 방식은 double progression이고,
각 운동의 rep_min/rep_max/target_sets/progression_step_kg를 사용해
다음 세션에서
- 증량 가능
- 중량 유지
- 디로드/볼륨 조정
중 하나를 제안해야 해.
결과는 training 화면과 exercise detail에 보여줘.

### 완료 기준
- pure function 테스트 포함
- 최근 기록 기준 추천이 계산됨
- UI에 배지/문구 표시

---

## Task 8 — Cardio + 천국의 계단 Quick Log

### 목표
유산소 빠른 입력.

### Codex 프롬프트
`/cardio` 페이지에 천국의 계단 quick logging을 구현해줘.
기본 preset:
- 운동명: 천국의 계단
- 레벨: 5
- 시간: 30분

요구사항:
- one-tap save
- 주간 횟수/총시간 표시
- calories/intensity note optional
- dashboard에 위젯 노출

### 완료 기준
- 10초 안에 기록 가능
- 주간 요약 표시

---

## Task 9 — Body Metrics + Check-in

### 목표
체중/허리/컨디션 입력과 추천 엔진 입력값 확보.

### Codex 프롬프트
`/body`와 daily check-in 입력 UI를 구현해줘.
요구사항:
- weight, waist, body fat, skeletal muscle 입력
- sleep, steps, hunger, digestive, appointments_count, prev_day_overeat 입력
- dashboard에서 최근 추세 차트 표시
- 오늘 recommendation 생성에 연결

### 완료 기준
- 입력 저장 가능
- 차트 보임
- recommendation engine input으로 사용됨

---

## Task 10 — Recommendation Engine

### 목표
상황별 추천 카드 생성.

### Codex 프롬프트
rule-based recommendation engine을 구현해줘.
다음 상황을 지원해야 해:
- 기본일
- 운동일
- 한 끼 약속
- 두 끼 약속
- 전날 과식 후 회복일
- 2주 정체기
- 오리궁뎅이 corrective routine 추천

출력은
- 식사 가이드
- 유산소 가이드
- corrective routine
- alert
형태의 카드여야 해.

### 완료 기준
- today 화면과 dashboard에 카드 표시
- context에 따라 문구가 달라짐

---

## Task 11 — Polish

### 목표
MVP 완성도 높이기.

### Codex 프롬프트
앱 전체 polish를 진행해줘.
요구사항:
- empty states
- loading states
- mobile spacing
- quick add buttons
- error handling
- import summary cleanup
- charts cleanup
- settings screen
- profile defaults 적용

### 완료 기준
- 모바일에서 사용성 괜찮음
- 주요 경로 에러 없이 동작
