-- Body OS - initial Supabase/Postgres schema
-- Designed for single-user first, multi-user ready

create extension if not exists "pgcrypto";

-- enums
do $$ begin
  create type goal_type as enum ('cut', 'maintain', 'bulk');
exception when duplicate_object then null; end $$;

do $$ begin
  create type exercise_type as enum ('strength', 'cardio', 'mobility', 'corrective');
exception when duplicate_object then null; end $$;

do $$ begin
  create type exercise_scope as enum ('generic', 'specific');
exception when duplicate_object then null; end $$;

do $$ begin
  create type measurement_mode as enum ('weight_reps_sets', 'time_only', 'time_level', 'checklist');
exception when duplicate_object then null; end $$;

do $$ begin
  create type meal_type as enum ('breakfast', 'lunch', 'snack', 'dinner', 'late_night');
exception when duplicate_object then null; end $$;

do $$ begin
  create type context_type as enum ('default', 'training', 'one_appointment', 'two_appointments', 'recovery');
exception when duplicate_object then null; end $$;

do $$ begin
  create type macro_status as enum ('complete', 'partial', 'missing');
exception when duplicate_object then null; end $$;

do $$ begin
  create type session_type as enum ('strength', 'cardio', 'corrective', 'mixed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type logged_mode as enum ('aggregate', 'detailed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type recommendation_type as enum (
    'base_day',
    'training_day',
    'one_appointment_day',
    'two_appointments_day',
    'post_overeat_recovery',
    'plateau_response',
    'corrective_routine',
    'deload_flag'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type cardio_intensity as enum ('easy', 'moderate', 'hard');
exception when duplicate_object then null; end $$;

-- profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  display_name text,
  height_cm numeric(5,2),
  current_weight_kg numeric(6,2),
  goal_weight_kg numeric(6,2),
  protein_target_g integer default 170,
  main_cardio text default 'stairmaster',
  primary_split text default 'back/chest/shoulder/arms_legs',
  default_lunch_rice_g_min integer default 150,
  default_lunch_rice_g_max integer default 210,
  default_dinner_rice_g_min integer default 100,
  default_dinner_rice_g_max integer default 150,
  one_appointment_rice_g_min integer default 50,
  one_appointment_rice_g_max integer default 100,
  two_appointment_home_rice_g_min integer default 0,
  two_appointment_home_rice_g_max integer default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- goals
create table if not exists goal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  goal_type goal_type not null default 'cut',
  start_date date not null,
  end_date date,
  target_weight_kg numeric(6,2),
  activity_level text,
  constitution_type text,
  training_focus text,
  protein_target_g integer,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- recommendation rules
create table if not exists recommendation_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  rule_type recommendation_type not null,
  priority integer not null default 100,
  conditions_json jsonb not null default '{}'::jsonb,
  actions_json jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- food master
create table if not exists food_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  food_group text,
  base_quantity numeric(10,2) not null,
  base_unit text not null,
  kcal numeric(10,2),
  carbs_g numeric(10,2),
  protein_g numeric(10,2),
  fat_g numeric(10,2),
  macro_status macro_status not null default 'complete',
  is_macro_estimated boolean not null default false,
  is_favorite boolean not null default false,
  is_active boolean not null default true,
  source text default 'manual',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_food_items_user_name on food_items(user_id, name);

-- meals
create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  meal_date date not null,
  eaten_at timestamptz,
  meal_type meal_type not null,
  context_type context_type not null default 'default',
  note text,
  total_kcal numeric(10,2) not null default 0,
  total_carbs_g numeric(10,2) not null default 0,
  total_protein_g numeric(10,2) not null default 0,
  total_fat_g numeric(10,2) not null default 0,
  imported_legacy boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_meals_user_date on meals(user_id, meal_date);

create table if not exists meal_entries (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references meals(id) on delete cascade,
  food_item_id uuid references food_items(id) on delete set null,
  custom_food_name text,
  quantity numeric(10,2) not null,
  unit text not null,
  kcal numeric(10,2) not null default 0,
  carbs_g numeric(10,2) not null default 0,
  protein_g numeric(10,2) not null default 0,
  fat_g numeric(10,2) not null default 0,
  is_estimated boolean not null default false,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- exercise master
create table if not exists exercise_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  exercise_type exercise_type not null,
  exercise_scope exercise_scope not null default 'specific',
  body_part text,
  equipment text,
  measurement_mode measurement_mode not null,
  is_free_weight boolean not null default false,
  default_rep_min integer,
  default_rep_max integer,
  default_rir integer,
  progression_step_kg numeric(6,2),
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_exercise_items_user_name on exercise_items(user_id, name);

-- workout program
create table if not exists workout_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  description text,
  focus text,
  cycle_mode text default 'rolling',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workout_program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references workout_programs(id) on delete cascade,
  day_order integer not null,
  name text not null,
  focus text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(program_id, day_order)
);

create table if not exists workout_program_day_exercises (
  id uuid primary key default gen_random_uuid(),
  program_day_id uuid not null references workout_program_days(id) on delete cascade,
  exercise_item_id uuid not null references exercise_items(id) on delete restrict,
  sort_order integer not null default 1,
  target_sets integer not null default 3,
  rep_min integer,
  rep_max integer,
  target_rir integer,
  rest_seconds integer,
  progression_method text default 'double_progression',
  progression_step_kg numeric(6,2),
  is_priority boolean not null default false,
  is_corrective_required_before boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(program_day_id, sort_order)
);

-- workout sessions
create table if not exists workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  session_date date not null,
  program_day_id uuid references workout_program_days(id) on delete set null,
  session_type session_type not null default 'strength',
  readiness_score integer,
  completed boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_workout_sessions_user_date on workout_sessions(user_id, session_date);

create table if not exists strength_exercise_logs (
  id uuid primary key default gen_random_uuid(),
  workout_session_id uuid not null references workout_sessions(id) on delete cascade,
  exercise_item_id uuid not null references exercise_items(id) on delete restrict,
  body_part text,
  logged_mode logged_mode not null default 'detailed',
  weight_kg numeric(10,2),
  reps integer,
  sets_count integer,
  target_rir integer,
  total_volume_kg numeric(12,2),
  is_pr boolean not null default false,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_strength_logs_session on strength_exercise_logs(workout_session_id);

create table if not exists strength_set_logs (
  id uuid primary key default gen_random_uuid(),
  strength_exercise_log_id uuid not null references strength_exercise_logs(id) on delete cascade,
  set_order integer not null,
  weight_kg numeric(10,2),
  reps integer,
  rir integer,
  is_top_set boolean not null default false,
  is_backoff boolean not null default false,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(strength_exercise_log_id, set_order)
);

create table if not exists cardio_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  workout_session_id uuid references workout_sessions(id) on delete set null,
  exercise_item_id uuid references exercise_items(id) on delete set null,
  performed_at timestamptz,
  duration_min integer not null,
  level integer,
  distance_km numeric(8,2),
  calories_kcal numeric(10,2),
  avg_hr integer,
  intensity cardio_intensity,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cardio_logs_user_date on cardio_logs(user_id, performed_at);

create table if not exists body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  recorded_on date not null,
  weight_kg numeric(6,2),
  waist_cm numeric(6,2),
  body_fat_pct numeric(5,2),
  skeletal_muscle_kg numeric(6,2),
  fat_mass_kg numeric(6,2),
  visceral_fat_level integer,
  inbody_score integer,
  source text default 'manual',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_body_metrics_user_date on body_metrics(user_id, recorded_on);

create table if not exists daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date date not null,
  appointments_count integer not null default 0,
  trained_today boolean not null default false,
  planned_program_day_id uuid references workout_program_days(id) on delete set null,
  sleep_hours numeric(4,2),
  steps integer,
  stress_score integer,
  hunger_score integer,
  digestive_score integer,
  prev_day_overeat boolean not null default false,
  lower_body_fatigue_score integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, date)
);

create table if not exists corrective_routine_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date date not null,
  routine_name text not null,
  item_name text not null,
  completed boolean not null default false,
  duration_min integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_corrective_logs_user_date on corrective_routine_logs(user_id, date);

create table if not exists generated_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date date not null,
  recommendation_type recommendation_type not null,
  title text not null,
  body text not null,
  context_json jsonb not null default '{}'::jsonb,
  actions_json jsonb not null default '{}'::jsonb,
  source_rule_id uuid references recommendation_rules(id) on delete set null,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_generated_recommendations_user_date on generated_recommendations(user_id, date);

-- optional helper views
create or replace view meal_daily_summary as
select
  user_id,
  meal_date,
  sum(total_kcal) as total_kcal,
  sum(total_carbs_g) as total_carbs_g,
  sum(total_protein_g) as total_protein_g,
  sum(total_fat_g) as total_fat_g,
  count(*) as meals_count
from meals
group by user_id, meal_date;

create or replace view cardio_daily_summary as
select
  user_id,
  date(performed_at) as performed_on,
  count(*) as sessions_count,
  sum(duration_min) as total_duration_min,
  sum(coalesce(calories_kcal, 0)) as total_calories_kcal
from cardio_logs
group by user_id, date(performed_at);

create or replace view strength_daily_summary as
select
  ws.user_id,
  ws.session_date,
  count(distinct sel.id) as exercise_count,
  sum(coalesce(sel.total_volume_kg, 0)) as total_volume_kg
from workout_sessions ws
left join strength_exercise_logs sel on sel.workout_session_id = ws.id
group by ws.user_id, ws.session_date;
