# 화면 / 정보구조 명세

## 1. 모바일 우선 라우트 구조

- `/` — 홈 대시보드
- `/today` — 오늘 실행 화면
- `/meals` — 식사 기록
- `/training` — 운동 기록
- `/cardio` — 유산소 기록
- `/body` — 체중/허리/InBody
- `/goals` — 목표 플랜
- `/rules` — 추천 규칙
- `/library/foods` — Food Master
- `/library/exercises` — Exercise Master
- `/program` — 루틴 템플릿
- `/import` — CSV import
- `/settings` — 기본 설정

## 2. 홈 대시보드 `/`

### 목적
앱을 열었을 때 오늘 무엇을 해야 하는지 가장 먼저 보여주는 화면.

### 상단 카드
- 오늘 날짜
- 오늘 day type
  - 기본일
  - 운동일
  - 한 끼 약속
  - 두 끼 약속
  - 회복일
- 오늘 program day
- 오늘 단백질 목표

### 핵심 위젯
1. **오늘 추천 카드**
   - 점심 밥 범위
   - 저녁 밥 범위
   - 단백질 보강
   - 오늘 유산소
   - 오늘 교정 루틴
2. **단백질 진행률**
3. **최근 7일 체중 차트**
4. **이번 주 천국의 계단 횟수**
5. **오늘 루틴 진행률**
6. **주의 알림**
   - 전날 과식
   - 2주 정체
   - 수면 부족
   - 하체 피로 누적

## 3. 오늘 실행 화면 `/today`

### 목적
오늘 해야 할 행동을 체크리스트처럼 수행하도록 유도.

### 섹션
- 오늘 식사 가이드
- 오늘 운동 가이드
- 오늘 유산소 가이드
- 오늘 교정 루틴
- 빠른 입력 버튼
  - 점심 추가
  - 간식 추가
  - 저녁 추가
  - 운동 시작
  - 천국의 계단 완료
  - 체중 입력

## 4. 식사 기록 `/meals`

### 탭
- Today
- History
- Templates
- Foods

### Today 화면
- 식사 카드 목록
- 식사별 탄단지 합계
- 하단 FAB: `+ 식사 추가`

### 식사 추가 bottom sheet
입력 항목:
- 식사 구분
- 날짜/시간
- context type
- 음식 검색
- 수량/단위
- custom food 여부
- 메모

### 핵심 UX
- 자주 먹는 음식 즐겨찾기
- “뒷다리살 200g” one-tap 추가
- “프로틴쉐이크” one-tap 추가
- “약속 식사” quick template 추가

## 5. 운동 기록 `/training`

### 탭
- Today Program
- Log History
- Exercises
- PRs

### Today Program
- 오늘 루틴 day
- 운동 목록
- 각 운동별 목표 세트/rep range/RIR
- 이전 기록 카드
- `세트 추가` 버튼
- `증량 가능` 배지

### 세트 입력 UX
- 무게
- 횟수
- RIR
- 세트 구분(top/backoff)
- 메모

### 운동 상세 drawer
- 최근 3회 기록
- 볼륨 추세
- top set 기록
- 권장 증량 여부
- 폼 메모

## 6. 유산소 `/cardio`

### 빠른 입력 모드
기본값:
- 운동명 = 천국의 계단
- 레벨 = 5
- 시간 = 30분

### 화면 요소
- 오늘 카드
- 이번 주 횟수
- 총 시간
- 최근 기록 리스트
- 강도/심박 메모

## 7. body metrics `/body`

### 입력 항목
- 체중
- 허리둘레
- 체지방률
- 골격근량
- 지방량
- 내장지방레벨
- InBody score
- 메모

### 시각화
- 체중 추세
- 허리 추세
- 체지방률 추세
- 체중 대비 허리 변화

## 8. goals `/goals`

### 표시 항목
- 활성 목표
- 시작일/종료일
- 남은 기간
- 목표 체중
- 단백질 목표
- 현재 추세
- 달성 확률(간단 추정)

## 9. rules `/rules`

### 목적
추천 로직을 사람이 읽고 수정할 수 있게.

### 기능
- 규칙 목록
- rule type 필터
- 우선순위 표시
- 조건 JSON / 액션 JSON 보기
- toggle on/off
- 테스트 입력
  - appointments_count
  - trained_today
  - prev_day_overeat
  - plateau
- 예상 출력 미리보기

## 10. program `/program`

### 목적
루틴 설계와 관리.

### 화면
- 활성 프로그램
- 분할 목록
- day별 운동 prescription
- 세트/rep range/RIR/progression 설정
- corrective warm-up 연결

## 11. import `/import`

### 단계
1. Food Master 업로드
2. Exercise Master 업로드
3. Meal Log 업로드
4. Strength Log 업로드
5. Cardio Log 업로드
6. Goal / Rule 업로드
7. 결과 검토

### import 결과 화면
- 성공 row 수
- 실패 row 수
- 누락 매크로 항목
- generic exercise 감지
- body metrics 미포함 안내

## 12. settings `/settings`

### 항목
- 키
- 기본 단백질 목표
- 밥 기준 범위
- 메인 유산소 기본값
- 주 분할 패턴
- 교정 루틴 기본값
- 디폴트 day type
