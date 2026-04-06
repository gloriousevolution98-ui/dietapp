# 데이터 감사 결과

## 1. 현재 export에서 확인한 구조

상위 페이지: `다이어트 시스템 구축`

확인된 핵심 데이터셋:

| 데이터셋 | 행 수 | 비고 |
|---|---:|---|
| Food Master | 12 | 음식 마스터 |
| Exercise Master | 8 | 운동 마스터 |
| Meal Log | 15 | 식사 로그, 1개 blank row 포함 |
| Strength Log | 10 | 근력 로그, 일부는 집계형/빈 값 존재 |
| Cardio Log | 4 | 유산소 로그, 1개 blank row 포함 |
| Goal Plan | 1 | 목표 플랜 |
| Recommendation Rule | 1 | 추천 규칙 |
| 변상원 개인화 문서 | 1 md | 운영 규칙 문서 |

## 2. 현재 데이터의 강점

### 2-1. 이미 DB 개념이 분리되어 있음
노션이 이미 아래 구조로 나뉘어 있어 앱 스키마로 옮기기 좋다.

- Food Master
- Exercise Master
- Meal Log
- Strength Log
- Cardio Log
- Goal Plan
- Recommendation Rule

### 2-2. 개인화 로직이 문서화되어 있음
`변상원 개인화` 문서에 앱의 추천 엔진으로 옮길 수 있는 핵심 로직이 정리되어 있다.

- 약속 없는 날 식사
- 한 끼 약속 있는 날 식사
- 두 끼 약속 있는 날 식사
- 운동일 탄수 보정
- 과식 다음 날 복귀
- 정체기 대응
- 상체 우선 / 하체 유지
- 천국의 계단 우선
- 체크 포인트

### 2-3. 현재 로그 양식이 이미 실사용 가능한 수준임
특히 아래가 좋다.

- 식사 로그에 총 탄단지와 칼로리가 있음
- 근력 로그에 무게/세트/횟수/총볼륨이 있음
- 유산소 로그에 시간/칼로리/강도 메모가 있음

## 3. 현재 데이터의 한계와 앱 설계 시 주의점

### 3-1. InBody Log는 페이지에 언급되지만 export에는 없음
메인 페이지에는 `InBody Log` 링크가 있지만 zip 안에는 CSV가 없다.  
따라서 앱 1차 버전에서는 아래처럼 처리한다.

- `body_metrics` 테이블은 만든다.
- weight / waist / body fat / skeletal muscle / visceral fat 입력 UI는 만든다.
- import 기능은 나중에 붙인다.

### 3-2. Food Master는 기준 단위가 섞여 있음
예시:
- 100g 기준 음식
- 1회분 기준 음식
- 1개 기준 음식

따라서 스키마는 **기준량 + 기준단위 + 매크로** 구조를 그대로 받아야 한다.

### 3-3. Food Master 일부 항목은 영양값이 비어 있음
예: 수육국밥(밥 반), 고기순대 등 일부 항목은 메모만 있고 영양값이 없다.

앱에서는 아래가 필요하다.

- `is_macro_estimated`
- `macro_status = complete | partial | missing`
- UI에서 “추정값 필요” 배지 노출

### 3-4. Meal Log는 현재 사실상 “식사 항목 단위 로그”
현재 CSV 구조는 하나의 row가 하나의 음식 섭취 로그에 가깝다.  
하지만 앱에서는 한 끼에 여러 음식을 묶을 수 있어야 한다.

따라서 import 전략은 아래가 맞다.

- 기존 row 1개를 `meal` 1개 + `meal_entry` 1개로 우선 가져간다.
- 이후 앱에서는 한 meal에 여러 entries를 추가할 수 있게 확장한다.

### 3-5. Strength Log는 set-by-set가 아니라 aggregate 중심
현재는
- 무게
- 횟수
- 세트
- 총볼륨
형태라, 실제 세트별 로그는 아니다.

따라서 앱에는 두 레벨이 필요하다.

1. `strength_exercise_logs` — 운동별 집계 레벨
2. `strength_set_logs` — 세트별 상세 레벨

과거 데이터 import는 집계 레벨로 넣고,  
앞으로의 앱 기록은 세트별로 쌓는 방식이 가장 현실적이다.

### 3-6. Exercise Master가 generic / specific 운동을 혼합함
예:
- 가슴운동, 어깨운동 같은 generic 운동
- 렛풀다운, 시티드 로우 같은 concrete 운동

따라서 `exercise_items`에는 아래 필드가 필요하다.

- `exercise_scope = generic | specific`
- `exercise_type = strength | cardio | mobility | corrective`

### 3-7. 추천 규칙 데이터는 아직 1건
현재 Recommendation Rule은 1건뿐이다.  
그래서 앱에서는 당장 복잡한 ML이 아니라 **rule-based engine**이 맞다.

## 4. 현재 export에서 바로 가져갈 핵심 운영 규칙

### 식사
- 단백질 160~180g
- 기본 구조: 점심 - 중간 단백질 - 저녁
- 약속 없는 날 탄수 기준:
  - 점심 밥 150~210g
  - 저녁 밥 100~150g
- 한 끼 약속:
  - 비약속 끼니 밥 50~100g
  - 약속 끼니 150~210g 허용
- 두 끼 약속:
  - 집 식사 밥 0~50g 또는 생략
  - 약속 끼니는 100~150g 수준 조절
- 약속 다음 날:
  - 굶지 않음
  - 단백질 유지
  - 기본 패턴 복귀

### 운동
- 상체 우선, 하체 유지
- 하체는 주 1회 유지 세션
- 메인 유산소는 천국의 계단
- 감량기에도 근력운동 유지가 우선
- 운동 퍼포먼스를 망칠 정도의 극단적 저탄수는 피함

### 체형교정
- 오리궁뎅이/골반 전방경사 보완
- 복압/골반중립/햄스트링-복근 협응 회복
- 교정 루틴:
  - 90/90 breathing
  - dead bug
  - reverse crunch
  - hamstring bridge hold
  - hip flexor stretch
  - wall slide

## 5. 앱 설계에 반영해야 할 결론

이 앱은 단순 기록 앱이 아니라 **개인 운영 규칙이 내장된 코치형 앱**이어야 한다.

즉,
- 로그 저장
- 대시보드 시각화
- 추천 규칙 실행
- 점진적 과부하 판단
- 복귀 가이드 제안
까지 묶여야 한다.
