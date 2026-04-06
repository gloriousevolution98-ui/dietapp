import type {
  BodyMetricSource,
  CardioIntensity,
  ContextType,
  ExerciseScope,
  ExerciseType,
  GoalType,
  LoggedMode,
  MacroStatus,
  MealType,
  MeasurementMode,
  RecommendationType,
  SessionType,
} from "@/lib/types/enums";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Timestamp = string;
type UUID = string;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: UUID;
          user_id: UUID;
          display_name: string | null;
          height_cm: number | null;
          current_weight_kg: number | null;
          goal_weight_kg: number | null;
          protein_target_g: number;
          main_cardio: string | null;
          primary_split: string | null;
          default_lunch_rice_g_min: number;
          default_lunch_rice_g_max: number;
          default_dinner_rice_g_min: number;
          default_dinner_rice_g_max: number;
          one_appointment_rice_g_min: number;
          one_appointment_rice_g_max: number;
          two_appointment_home_rice_g_min: number;
          two_appointment_home_rice_g_max: number;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          display_name?: string | null;
          height_cm?: number | null;
          current_weight_kg?: number | null;
          goal_weight_kg?: number | null;
          protein_target_g?: number;
          main_cardio?: string | null;
          primary_split?: string | null;
          default_lunch_rice_g_min?: number;
          default_lunch_rice_g_max?: number;
          default_dinner_rice_g_min?: number;
          default_dinner_rice_g_max?: number;
          one_appointment_rice_g_min?: number;
          one_appointment_rice_g_max?: number;
          two_appointment_home_rice_g_min?: number;
          two_appointment_home_rice_g_max?: number;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      goal_plans: {
        Row: {
          id: UUID;
          user_id: UUID;
          name: string;
          goal_type: GoalType;
          start_date: string;
          end_date: string | null;
          target_weight_kg: number | null;
          activity_level: string | null;
          constitution_type: string | null;
          training_focus: string | null;
          protein_target_g: number | null;
          is_active: boolean;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          name: string;
          goal_type?: GoalType;
          start_date: string;
          end_date?: string | null;
          target_weight_kg?: number | null;
          activity_level?: string | null;
          constitution_type?: string | null;
          training_focus?: string | null;
          protein_target_g?: number | null;
          is_active?: boolean;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["goal_plans"]["Insert"]>;
      };
      recommendation_rules: {
        Row: {
          id: UUID;
          user_id: UUID;
          name: string;
          rule_type: RecommendationType;
          priority: number;
          conditions_json: Json;
          actions_json: Json;
          active: boolean;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          name: string;
          rule_type: RecommendationType;
          priority?: number;
          conditions_json?: Json;
          actions_json?: Json;
          active?: boolean;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["recommendation_rules"]["Insert"]
        >;
      };
      food_items: {
        Row: {
          id: UUID;
          user_id: UUID;
          name: string;
          food_group: string | null;
          base_quantity: number;
          base_unit: string;
          kcal: number | null;
          carbs_g: number | null;
          protein_g: number | null;
          fat_g: number | null;
          macro_status: MacroStatus;
          is_macro_estimated: boolean;
          is_favorite: boolean;
          is_active: boolean;
          source: string | null;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          name: string;
          food_group?: string | null;
          base_quantity: number;
          base_unit: string;
          kcal?: number | null;
          carbs_g?: number | null;
          protein_g?: number | null;
          fat_g?: number | null;
          macro_status?: MacroStatus;
          is_macro_estimated?: boolean;
          is_favorite?: boolean;
          is_active?: boolean;
          source?: string | null;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["food_items"]["Insert"]>;
        Relationships: [];
      };
      meals: {
        Row: {
          id: UUID;
          user_id: UUID;
          meal_date: string;
          eaten_at: Timestamp | null;
          meal_type: MealType;
          context_type: ContextType;
          note: string | null;
          total_kcal: number;
          total_carbs_g: number;
          total_protein_g: number;
          total_fat_g: number;
          imported_legacy: boolean;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          meal_date: string;
          eaten_at?: Timestamp | null;
          meal_type: MealType;
          context_type?: ContextType;
          note?: string | null;
          total_kcal?: number;
          total_carbs_g?: number;
          total_protein_g?: number;
          total_fat_g?: number;
          imported_legacy?: boolean;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["meals"]["Insert"]>;
        Relationships: [];
      };
      meal_entries: {
        Row: {
          id: UUID;
          meal_id: UUID;
          food_item_id: UUID | null;
          custom_food_name: string | null;
          quantity: number;
          unit: string;
          kcal: number;
          carbs_g: number;
          protein_g: number;
          fat_g: number;
          is_estimated: boolean;
          memo: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          meal_id: UUID;
          food_item_id?: UUID | null;
          custom_food_name?: string | null;
          quantity: number;
          unit: string;
          kcal?: number;
          carbs_g?: number;
          protein_g?: number;
          fat_g?: number;
          is_estimated?: boolean;
          memo?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["meal_entries"]["Insert"]>;
        Relationships: [];
      };
      exercise_items: {
        Row: {
          id: UUID;
          user_id: UUID;
          name: string;
          exercise_type: ExerciseType;
          exercise_scope: ExerciseScope;
          body_part: string | null;
          equipment: string | null;
          measurement_mode: MeasurementMode;
          is_free_weight: boolean;
          default_rep_min: number | null;
          default_rep_max: number | null;
          default_rir: number | null;
          progression_step_kg: number | null;
          is_active: boolean;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          name: string;
          exercise_type: ExerciseType;
          exercise_scope?: ExerciseScope;
          body_part?: string | null;
          equipment?: string | null;
          measurement_mode: MeasurementMode;
          is_free_weight?: boolean;
          default_rep_min?: number | null;
          default_rep_max?: number | null;
          default_rir?: number | null;
          progression_step_kg?: number | null;
          is_active?: boolean;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["exercise_items"]["Insert"]
        >;
      };
      workout_programs: {
        Row: {
          id: UUID;
          user_id: UUID;
          name: string;
          description: string | null;
          focus: string | null;
          cycle_mode: string | null;
          is_active: boolean;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          name: string;
          description?: string | null;
          focus?: string | null;
          cycle_mode?: string | null;
          is_active?: boolean;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["workout_programs"]["Insert"]
        >;
      };
      workout_program_days: {
        Row: {
          id: UUID;
          program_id: UUID;
          day_order: number;
          name: string;
          focus: string | null;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          program_id: UUID;
          day_order: number;
          name: string;
          focus?: string | null;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["workout_program_days"]["Insert"]
        >;
      };
      workout_program_day_exercises: {
        Row: {
          id: UUID;
          program_day_id: UUID;
          exercise_item_id: UUID;
          sort_order: number;
          target_sets: number;
          rep_min: number | null;
          rep_max: number | null;
          target_rir: number | null;
          rest_seconds: number | null;
          progression_method: string | null;
          progression_step_kg: number | null;
          is_priority: boolean;
          is_corrective_required_before: boolean;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          program_day_id: UUID;
          exercise_item_id: UUID;
          sort_order?: number;
          target_sets?: number;
          rep_min?: number | null;
          rep_max?: number | null;
          target_rir?: number | null;
          rest_seconds?: number | null;
          progression_method?: string | null;
          progression_step_kg?: number | null;
          is_priority?: boolean;
          is_corrective_required_before?: boolean;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["workout_program_day_exercises"]["Insert"]
        >;
      };
      workout_sessions: {
        Row: {
          id: UUID;
          user_id: UUID;
          session_date: string;
          program_day_id: UUID | null;
          session_type: SessionType;
          readiness_score: number | null;
          completed: boolean;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          session_date: string;
          program_day_id?: UUID | null;
          session_type?: SessionType;
          readiness_score?: number | null;
          completed?: boolean;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["workout_sessions"]["Insert"]
        >;
      };
      strength_exercise_logs: {
        Row: {
          id: UUID;
          workout_session_id: UUID;
          exercise_item_id: UUID;
          body_part: string | null;
          logged_mode: LoggedMode;
          weight_kg: number | null;
          reps: number | null;
          sets_count: number | null;
          target_rir: number | null;
          total_volume_kg: number | null;
          is_pr: boolean;
          memo: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          workout_session_id: UUID;
          exercise_item_id: UUID;
          body_part?: string | null;
          logged_mode?: LoggedMode;
          weight_kg?: number | null;
          reps?: number | null;
          sets_count?: number | null;
          target_rir?: number | null;
          total_volume_kg?: number | null;
          is_pr?: boolean;
          memo?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["strength_exercise_logs"]["Insert"]
        >;
      };
      strength_set_logs: {
        Row: {
          id: UUID;
          strength_exercise_log_id: UUID;
          set_order: number;
          weight_kg: number | null;
          reps: number | null;
          rir: number | null;
          is_top_set: boolean;
          is_backoff: boolean;
          completed: boolean;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          strength_exercise_log_id: UUID;
          set_order: number;
          weight_kg?: number | null;
          reps?: number | null;
          rir?: number | null;
          is_top_set?: boolean;
          is_backoff?: boolean;
          completed?: boolean;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["strength_set_logs"]["Insert"]
        >;
      };
      cardio_logs: {
        Row: {
          id: UUID;
          user_id: UUID;
          workout_session_id: UUID | null;
          exercise_item_id: UUID | null;
          performed_at: Timestamp | null;
          duration_min: number;
          level: number | null;
          distance_km: number | null;
          calories_kcal: number | null;
          avg_hr: number | null;
          intensity: CardioIntensity | null;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          workout_session_id?: UUID | null;
          exercise_item_id?: UUID | null;
          performed_at?: Timestamp | null;
          duration_min: number;
          level?: number | null;
          distance_km?: number | null;
          calories_kcal?: number | null;
          avg_hr?: number | null;
          intensity?: CardioIntensity | null;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["cardio_logs"]["Insert"]>;
      };
      body_metrics: {
        Row: {
          id: UUID;
          user_id: UUID;
          recorded_on: string;
          weight_kg: number | null;
          waist_cm: number | null;
          body_fat_pct: number | null;
          skeletal_muscle_kg: number | null;
          fat_mass_kg: number | null;
          visceral_fat_level: number | null;
          inbody_score: number | null;
          source: BodyMetricSource | string | null;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          recorded_on: string;
          weight_kg?: number | null;
          waist_cm?: number | null;
          body_fat_pct?: number | null;
          skeletal_muscle_kg?: number | null;
          fat_mass_kg?: number | null;
          visceral_fat_level?: number | null;
          inbody_score?: number | null;
          source?: BodyMetricSource | string | null;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<Database["public"]["Tables"]["body_metrics"]["Insert"]>;
      };
      daily_checkins: {
        Row: {
          id: UUID;
          user_id: UUID;
          date: string;
          appointments_count: number;
          trained_today: boolean;
          planned_program_day_id: UUID | null;
          sleep_hours: number | null;
          steps: number | null;
          stress_score: number | null;
          hunger_score: number | null;
          digestive_score: number | null;
          prev_day_overeat: boolean;
          lower_body_fatigue_score: number | null;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          date: string;
          appointments_count?: number;
          trained_today?: boolean;
          planned_program_day_id?: UUID | null;
          sleep_hours?: number | null;
          steps?: number | null;
          stress_score?: number | null;
          hunger_score?: number | null;
          digestive_score?: number | null;
          prev_day_overeat?: boolean;
          lower_body_fatigue_score?: number | null;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["daily_checkins"]["Insert"]
        >;
      };
      corrective_routine_logs: {
        Row: {
          id: UUID;
          user_id: UUID;
          date: string;
          routine_name: string;
          item_name: string;
          completed: boolean;
          duration_min: number | null;
          notes: string | null;
          created_at: Timestamp;
          updated_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          date: string;
          routine_name: string;
          item_name: string;
          completed?: boolean;
          duration_min?: number | null;
          notes?: string | null;
          created_at?: Timestamp;
          updated_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["corrective_routine_logs"]["Insert"]
        >;
      };
      generated_recommendations: {
        Row: {
          id: UUID;
          user_id: UUID;
          date: string;
          recommendation_type: RecommendationType;
          title: string;
          body: string;
          context_json: Json;
          actions_json: Json;
          source_rule_id: UUID | null;
          acknowledged_at: Timestamp | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          date: string;
          recommendation_type: RecommendationType;
          title: string;
          body: string;
          context_json?: Json;
          actions_json?: Json;
          source_rule_id?: UUID | null;
          acknowledged_at?: Timestamp | null;
          created_at?: Timestamp;
        };
        Update: Partial<
          Database["public"]["Tables"]["generated_recommendations"]["Insert"]
        >;
      };
    };
    Views: {
      meal_daily_summary: {
        Row: {
          user_id: UUID | null;
          meal_date: string | null;
          total_kcal: number | null;
          total_carbs_g: number | null;
          total_protein_g: number | null;
          total_fat_g: number | null;
          meals_count: number | null;
        };
      };
      cardio_daily_summary: {
        Row: {
          user_id: UUID | null;
          performed_on: string | null;
          sessions_count: number | null;
          total_duration_min: number | null;
          total_calories_kcal: number | null;
        };
      };
      strength_daily_summary: {
        Row: {
          user_id: UUID | null;
          session_date: string | null;
          exercise_count: number | null;
          total_volume_kg: number | null;
        };
      };
    };
  };
};

type PublicSchema = Database["public"];
export type TableName = keyof PublicSchema["Tables"];

export type TableRow<T extends TableName> = PublicSchema["Tables"][T]["Row"];
export type TableInsert<T extends TableName> = PublicSchema["Tables"][T]["Insert"];
export type TableUpdate<T extends TableName> = PublicSchema["Tables"][T]["Update"];
