# SCHEMA 설계

## 1. 설계 원칙

1. 기존 Notion의 Master / Log / Goal / Rule 구조를 유지한다.
2. 과거 import 데이터는 **집계형 로그**로도 수용한다.
3. 앞으로의 앱 기록은 가능하면 **세트 단위**까지 지원한다.
4. meal은 여러 food entry를 가질 수 있어야 한다.
5. 추천 엔진은 rule-based로 먼저 구현한다.
6. 교정 루틴과 일반 운동을 같은 운동 시스템 안에서 다룰 수 있어야 한다.

## 2. 핵심 엔터티 요약

| 테이블 | 목적 |
|---|---|
| profiles | 사용자 기본 설정 |
| goal_plans | 감량/유지 목표 |
| recommendation_rules | 추천 규칙 |
| food_items | 음식 마스터 |
| meals | 한 끼 단위 |
| meal_entries | meal 내부 음식 항목 |
| exercise_items | 운동 마스터 |
| workout_programs | 프로그램 |
| workout_program_days | 분할 day |
| workout_program_day_exercises | day별 운동 prescription |
| workout_sessions | 실제 운동 세션 |
| strength_exercise_logs | 운동별 집계 로그 |
| strength_set_logs | 세트별 상세 로그 |
| cardio_logs | 유산소 로그 |
| body_metrics | 체중/허리/InBody 계열 지표 |
| daily_checkins | 약속 수/수면/식욕/걸음/컨디션 |
| corrective_routine_logs | 오리궁뎅이 보완 루틴 체크 |
| generated_recommendations | 날짜별 생성 추천 결과 |

## 3. 테이블 상세

### 3-1. profiles
사용자별 기본 운영값.

핵심 필드:
- `id`
- `user_id`
- `display_name`
- `height_cm`
- `current_weight_kg`
- `goal_weight_kg`
- `protein_target_g`
- `main_cardio = stairmaster`
- `primary_split = back/chest/shoulder/arms_legs`
- `default_lunch_rice_g_min/max`
- `default_dinner_rice_g_min/max`
- `one_appointment_rice_g_min/max`
- `two_appointment_home_rice_g_min/max`

### 3-2. goal_plans
감량/유지 계획.

핵심 필드:
- `name`
- `goal_type = cut | maintain | bulk`
- `start_date`
- `end_date`
- `target_weight_kg`
- `activity_level`
- `constitution_type`
- `training_focus`
- `protein_target_g`
- `is_active`

### 3-3. recommendation_rules
규칙 엔진의 source of truth.

권장 구조:
- `name`
- `rule_type`
  - `base_day`
  - `training_day`
  - `one_appointment_day`
  - `two_appointment_day`
  - `post_overeat_recovery`
  - `plateau_response`
  - `corrective_routine`
  - `deload_flag`
- `priority`
- `conditions_json`
- `actions_json`
- `active`

예시 `actions_json`:
```json
{
  "protein_target_g": 170,
  "lunch_rice_g": [100, 150],
  "dinner_rice_g": [50, 100],
  "cardio_minutes": 30,
  "notes": [
    "굶지 말고 기본 식단으로 복귀",
    "지방 높은 외식은 피하기"
  ]
}
```

### 3-4. food_items
기존 Food Master 대응.

핵심 필드:
- `name`
- `food_group`
- `base_quantity`
- `base_unit`
- `kcal`
- `carbs_g`
- `protein_g`
- `fat_g`
- `macro_status = complete | partial | missing`
- `is_favorite`
- `is_active`
- `notes`

### 3-5. meals
한 끼 단위 container.

핵심 필드:
- `meal_date`
- `meal_type = breakfast | lunch | snack | dinner | late_night`
- `context_type = default | training | one_appointment | two_appointments | recovery`
- `note`
- `total_kcal`
- `total_carbs_g`
- `total_protein_g`
- `total_fat_g`

### 3-6. meal_entries
meal 내부 음식 항목.

핵심 필드:
- `meal_id`
- `food_item_id` (nullable)
- `custom_food_name` (nullable)
- `quantity`
- `unit`
- `kcal`
- `carbs_g`
- `protein_g`
- `fat_g`
- `is_estimated`
- `memo`

### 3-7. exercise_items
기존 Exercise Master 대응 + corrective 운동 포함.

핵심 필드:
- `name`
- `exercise_type = strength | cardio | mobility | corrective`
- `exercise_scope = generic | specific`
- `body_part`
- `equipment`
- `measurement_mode = weight_reps_sets | time_only | time_level | checklist`
- `is_free_weight`
- `default_rep_min`
- `default_rep_max`
- `default_rir`
- `progression_step_kg`
- `notes`

예시:
- 바벨로우 → strength / specific / back / barbell / weight_reps_sets / true
- 천국의 계단 → cardio / specific / lower / machine / time_level / false
- 90/90 breathing → corrective / specific / core / mat / checklist / false

### 3-8. workout_programs
활성 루틴.

핵심 필드:
- `name`
- `description`
- `is_active`
- `focus = upper_priority_cut`
- `cycle_mode = rolling`

### 3-9. workout_program_days
등 / 가슴 / 어깨 / 팔+하체 같은 분할 day.

핵심 필드:
- `program_id`
- `day_order`
- `name`
- `focus`
- `notes`

예시:
- 1: Back
- 2: Chest
- 3: Shoulder
- 4: Arms + Legs

### 3-10. workout_program_day_exercises
각 분할에 들어갈 prescription.

핵심 필드:
- `program_day_id`
- `exercise_item_id`
- `sort_order`
- `target_sets`
- `rep_min`
- `rep_max`
- `target_rir`
- `rest_seconds`
- `progression_method = double_progression`
- `progression_step_kg`
- `is_priority`
- `is_corrective_required_before`
- `notes`

### 3-11. workout_sessions
실제 운동한 session.

핵심 필드:
- `session_date`
- `program_day_id`
- `session_type = strength | cardio | corrective | mixed`
- `readiness_score`
- `completed`
- `notes`

### 3-12. strength_exercise_logs
운동 1종목에 대한 집계 로그.
과거 Notion import를 수용하기 위해 필요하다.

핵심 필드:
- `workout_session_id`
- `exercise_item_id`
- `body_part`
- `logged_mode = aggregate | detailed`
- `weight_kg`
- `reps`
- `sets_count`
- `target_rir`
- `total_volume_kg`
- `is_pr`
- `memo`

### 3-13. strength_set_logs
세트별 상세 로그.

핵심 필드:
- `strength_exercise_log_id`
- `set_order`
- `weight_kg`
- `reps`
- `rir`
- `is_top_set`
- `is_backoff`
- `completed`

### 3-14. cardio_logs
유산소 기록.

핵심 필드:
- `workout_session_id` (nullable)
- `exercise_item_id`
- `performed_at`
- `duration_min`
- `level`
- `distance_km`
- `calories_kcal`
- `avg_hr`
- `intensity = easy | moderate | hard`
- `notes`

### 3-15. body_metrics
체중/허리/InBody.

핵심 필드:
- `recorded_on`
- `weight_kg`
- `waist_cm`
- `body_fat_pct`
- `skeletal_muscle_kg`
- `fat_mass_kg`
- `visceral_fat_level`
- `inbody_score`
- `source = manual | inbody_import`

### 3-16. daily_checkins
하루 컨텍스트를 규칙 엔진에 넘기는 테이블.

핵심 필드:
- `date`
- `appointments_count`
- `trained_today`
- `planned_program_day_id`
- `sleep_hours`
- `steps`
- `stress_score`
- `hunger_score`
- `digestive_score`
- `prev_day_overeat`
- `lower_body_fatigue_score`
- `notes`

### 3-17. corrective_routine_logs
오리궁뎅이/골반 전방경사 보완 루틴 체크.

핵심 필드:
- `date`
- `routine_name`
- `item_name`
- `completed`
- `duration_min`
- `notes`

예시 item:
- 90/90 breathing
- dead bug
- reverse crunch
- hamstring bridge hold
- hip flexor stretch
- wall slide

### 3-18. generated_recommendations
앱이 계산해서 보여준 추천 결과 snapshot.

핵심 필드:
- `date`
- `recommendation_type`
- `title`
- `body`
- `context_json`
- `actions_json`
- `source_rule_id`
- `acknowledged_at`

## 4. 관계

- profile 1:N goal_plans
- profile 1:N food_items
- profile 1:N exercise_items
- meals 1:N meal_entries
- workout_programs 1:N workout_program_days
- workout_program_days 1:N workout_program_day_exercises
- workout_sessions 1:N strength_exercise_logs
- strength_exercise_logs 1:N strength_set_logs
- workout_sessions 1:N cardio_logs
- recommendation_rules 1:N generated_recommendations

## 5. import 매핑

### Food Master → food_items
- 음식명 → name
- 음식군 → food_group
- 기준량 → base_quantity
- 기준 단위 → base_unit
- 칼로리 → kcal
- 탄수화물 → carbs_g
- 단백질 → protein_g
- 지방 → fat_g
- 메모 → notes

### Exercise Master → exercise_items
- 운동명 → name
- 운동 유형 → exercise_type
- 운동 부위 → body_part
- 측정 기준 → measurement_mode
- 메모 → notes

### Meal Log → meals + meal_entries
- row 1개당 meal 1개 생성
- meal_entry 1개 연결
- 추후 multi-entry meal 허용

### Strength Log → workout_sessions + strength_exercise_logs
- 날짜 기준 session 생성
- 종목별 row를 aggregate log로 저장
- 가능한 경우 total_volume 사용
- 세트별 상세는 future log부터 적용

### Cardio Log → cardio_logs
- 날짜, 시간, 칼로리, 강도, 메모 저장

### Goal Plan → goal_plans
### Recommendation Rule → recommendation_rules

## 6. 파생 계산

### meal total
`meal_entries` 합계를 `meals`에 반영

### daily protein
하루 `meals.total_protein_g` 합

### total volume
`strength_set_logs.weight_kg * reps` 합 또는 import된 aggregate volume

### progressive overload eligibility
조건:
- 최근 동일 종목 1~3회 기록 존재
- work set 전부 상단 반복수 도달
- target RIR 범위 유지
- 최근 readiness 과도 저하 없음

## 7. 왜 이 구조가 맞는가

이 구조는 아래를 동시에 만족한다.

- 현재 Notion 데이터를 거의 그대로 import 가능
- 앞으로는 세트별 고도화 가능
- rule-based coaching 구현 가능
- 상체 우선 루틴 템플릿 반영 가능
- 교정 루틴도 운동 시스템 안에서 추적 가능
