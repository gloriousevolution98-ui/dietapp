export const goalTypes = ["cut", "maintain", "bulk"] as const;
export const exerciseTypes = [
  "strength",
  "cardio",
  "mobility",
  "corrective",
] as const;
export const exerciseScopes = ["generic", "specific"] as const;
export const measurementModes = [
  "weight_reps_sets",
  "time_only",
  "time_level",
  "checklist",
] as const;
export const mealTypes = [
  "breakfast",
  "lunch",
  "snack",
  "dinner",
  "late_night",
] as const;
export const contextTypes = [
  "default",
  "training",
  "one_appointment",
  "two_appointments",
  "recovery",
] as const;
export const macroStatuses = ["complete", "partial", "missing"] as const;
export const sessionTypes = [
  "strength",
  "cardio",
  "corrective",
  "mixed",
] as const;
export const loggedModes = ["aggregate", "detailed"] as const;
export const recommendationTypes = [
  "base_day",
  "training_day",
  "one_appointment_day",
  "two_appointments_day",
  "post_overeat_recovery",
  "plateau_response",
  "corrective_routine",
  "deload_flag",
] as const;
export const cardioIntensities = ["easy", "moderate", "hard"] as const;
export const bodyMetricSources = ["manual", "inbody_import"] as const;

export type GoalType = (typeof goalTypes)[number];
export type ExerciseType = (typeof exerciseTypes)[number];
export type ExerciseScope = (typeof exerciseScopes)[number];
export type MeasurementMode = (typeof measurementModes)[number];
export type MealType = (typeof mealTypes)[number];
export type ContextType = (typeof contextTypes)[number];
export type MacroStatus = (typeof macroStatuses)[number];
export type SessionType = (typeof sessionTypes)[number];
export type LoggedMode = (typeof loggedModes)[number];
export type RecommendationType = (typeof recommendationTypes)[number];
export type CardioIntensity = (typeof cardioIntensities)[number];
export type BodyMetricSource = (typeof bodyMetricSources)[number];
