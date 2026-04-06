# RULE ENGINE / 추천 로직

## 1. 개요

추천 엔진은 복잡한 AI보다 **명시적 rule-based engine**으로 시작한다.  
이유는 현재 데이터 양이 작고, 사용자의 운영 규칙이 이미 문서화되어 있기 때문이다.

입력:
- profile
- active goal
- daily_checkin
- yesterday meals/workouts
- recent 14-day body metrics
- today planned program day

출력:
- 오늘 day type
- 점심/저녁 탄수 범위
- 단백질 보강 여부
- 유산소 권장
- 교정 루틴 권장
- 하체 볼륨/피로 조정
- 증량 가능 종목

## 2. day type 결정 로직

우선순위 순서:

1. `prev_day_overeat = true` → `recovery_day`
2. `appointments_count >= 2` → `two_appointments_day`
3. `appointments_count = 1` → `one_appointment_day`
4. `trained_today = true` → `training_day`
5. 그 외 → `base_day`

주의:
- `recovery_day`와 `training_day`가 동시에 성립할 수 있다.
- 실제 구현은 primary day type + modifier 형태로 두는 것이 좋다.

예:
- primary: `recovery_day`
- modifiers: `training_day`

## 3. 식사 추천 규칙

### 3-1. base day
- 점심 밥: 150~210g
- 저녁 밥: 100~150g
- 단백질: 160~180g
- 중간 단백질 보강 1회 권장

### 3-2. training day
base day 위에 추가:
- 운동 전후 탄수 80~100g 추가 허용 또는 바나나 1개
- 퍼포먼스가 떨어지면 탄수 너무 공격적으로 깎지 않음

### 3-3. one appointment day
- 비약속 끼니 밥: 50~100g
- 약속 끼니 밥: 150~210g
- 약속 전에 단백질 소량 섭취 권장
- 굶고 가지 않음

### 3-4. two appointments day
- 집 식사 밥: 0~50g 또는 생략
- 약속 끼니 각 100~150g 수준
- 단백질 우선
- 술/튀김/디저트 중복 피하기

### 3-5. recovery day (전날 과식 후)
기본 원칙:
- 굶지 않음
- 노탄수 벌칙 금지
- 단백질 유지
- 지방 낮추기
- 탄수만 평소보다 약간 감산

권장:
- 점심 밥 100~150g
- 저녁 밥 50~100g
- 식욕이 매우 낮으면 저녁 0~50g 허용
- 물 충분히
- 활동량 유지
- 천국의 계단 30분 가능

### 3-6. manual override
사용자가 직접 “오늘 회식/약속 있음”, “전날 과식”, “운동 강도 높음”을 override 할 수 있어야 한다.

## 4. 정체기 규칙

### plateau 조건
아래 둘 다 충족 시 plateau 가능성:
- 최근 14일 평균 체중 변화 거의 없음
- 최근 14일 허리둘레 변화 거의 없음

### plateau 단계
1단계:
- 걷기 2000보 추가
- 야식/음료/디저트 점검

2단계:
- 저녁 탄수 30~50g 감산

3단계:
- 유산소 1~2회 추가

4단계:
- 피로가 크면 5~7일 유지기 권장

## 5. 오리궁뎅이 / 골반 전방경사 보완 규칙

### 기본 교정 루틴
- 90/90 breathing
- dead bug
- reverse crunch
- hamstring bridge hold
- hip flexor stretch
- wall slide

### 언제 띄울 것인가
- 어깨/가슴/등 운동 전: 90/90, dead bug
- 팔+하체 day: full corrective routine
- recovery day: 5~10분 가벼운 corrective
- 허리 과신전 메모가 2회 이상 누적되면 강조 배지 노출

### weekly 목표
- 주 3~4회 수행

## 6. 점진적 과부하 규칙

### 기본 방식: double progression
각 운동은 아래를 가진다.
- rep_min
- rep_max
- target_sets
- target_rir
- progression_step_kg

#### 증량 조건
모든 work set이 아래 충족 시 다음 세션 증량:
- reps >= rep_max
- final set RIR이 허용 범위 내
- 폼 이슈 flag 없음

예:
- 바벨로우 4세트 6~8회
- 70kg에서 8/8/8/8 달성
- 다음 세션 72.5kg 추천

#### 유지 조건
- 일부 세트가 rep_max 미도달이면 중량 유지
- 다음 세션에서 반복수 채우기 우선

#### 감량/조정 조건
- 2~3회 연속 퍼포먼스 하락
- 수면/피로/통증 이슈 있음
- then: 중량 유지 또는 5~10% 조정 / 세트 감소

## 7. upper-priority 루틴 규칙

기본 분할:
- 등
- 가슴
- 어깨
- 팔+하체

운영 원칙:
- 상체는 높은 빈도
- 하체는 유지용 최소 볼륨
- 둔근 직접 성장성 볼륨은 낮춤
- 천국의 계단은 별도 유산소로 유지

### 하체 세션 볼륨 규칙
- 총 6~10세트 전후
- 대퇴사두 2~4세트
- 햄스트링/힙힌지 2~4세트
- 보조 1~3세트
- 힙쓰러스트/고볼륨 런지/둔근 펌핑 위주 동작은 낮은 우선순위

## 8. 추천 카드 예시

### 예시 A — 회복일
제목: 과식 다음 날 복귀 가이드  
내용:
- 점심 밥 100~150g
- 저녁 밥 50~100g
- 단백질은 170g 근처 유지
- 굶지 말고 천국의 계단 30분
- 지방 많은 외식 피하기

### 예시 B — one appointment training day
제목: 운동 + 저녁 약속 조합  
내용:
- 점심은 밥 80~100g
- 운동 전 쉐이크 + 바나나
- 저녁 약속은 밥 150~210g 안쪽
- 후식/음료는 중복 피하기

### 예시 C — plateau
제목: 2주 정체 대응  
내용:
- 걷기 2000보 추가
- 저녁 탄수 30g만 감산
- 천국의 계단 횟수 주 1회 추가
- 1주 후 다시 확인

## 9. 엔진 구현 순서

1. day type 계산 함수
2. 식사 recommendation 생성
3. plateau detector
4. corrective recommendation
5. progressive overload recommendation
6. recommendation snapshot 저장

## 10. pseudo-code

```ts
function buildDailyPlan(input: DailyContext): DailyPlan {
  const dayType = resolveDayType(input)
  const mealPlan = resolveMealPlan(dayType, input)
  const trainingPlan = resolveTrainingPlan(input)
  const cardioPlan = resolveCardioPlan(input)
  const correctivePlan = resolveCorrectivePlan(input)
  const alerts = resolveAlerts(input)

  return {
    dayType,
    mealPlan,
    trainingPlan,
    cardioPlan,
    correctivePlan,
    alerts,
  }
}
```
