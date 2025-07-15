// Health Daily Logs - Fetch and load daily health metrics
export const FETCH_HEALTH_DAILY_LOGS = "FETCH_HEALTH_DAILY_LOGS" as const;
export const LOAD_HEALTH_DAILY_LOGS = "LOAD_HEALTH_DAILY_LOGS" as const;

// Health Daily Weight - Edit daily weight entries
export const FETCH_EDIT_HEALTH_DAILY_WEIGHT =
  "FETCH_EDIT_HEALTH_DAILY_WEIGHT" as const;
export const LOAD_EDIT_HEALTH_DAILY_WEIGHT =
  "LOAD_EDIT_HEALTH_DAILY_WEIGHT" as const;

// Health Daily Steps - Edit daily steps entries
export const FETCH_EDIT_HEALTH_DAILY_STEPS =
  "FETCH_EDIT_HEALTH_DAILY_STEPS" as const;
export const LOAD_EDIT_HEALTH_DAILY_STEPS =
  "LOAD_EDIT_HEALTH_DAILY_STEPS" as const;

// Health Supplements - Fetch and manage supplement information
export const FETCH_HEALTH_SUPPLEMENTS = "FETCH_HEALTH_SUPPLEMENTS" as const;
export const LOAD_HEALTH_SUPPLEMENTS = "LOAD_HEALTH_SUPPLEMENTS" as const;

// Health Supplement Logs - Track supplement intake logs
export const FETCH_HEALTH_SUPPLEMENT_LOGS =
  "FETCH_HEALTH_SUPPLEMENT_LOGS" as const;
export const LOAD_HEALTH_SUPPLEMENT_LOGS =
  "LOAD_HEALTH_SUPPLEMENT_LOGS" as const;

// Health Supplement Log Toggle - Toggle supplement intake status
export const FETCH_TOGGLE_HEALTH_SUPPLEMENT_LOG =
  "FETCH_TOGGLE_HEALTH_SUPPLEMENT_LOG" as const;
export const LOAD_TOGGLE_HEALTH_SUPPLEMENT_LOG =
  "LOAD_TOGGLE_HEALTH_SUPPLEMENT_LOG" as const;

// Health Daily Body Fat - Edit daily body fat percentage entries
export const FETCH_EDIT_HEALTH_DAILY_BODYFAT =
  "FETCH_EDIT_HEALTH_DAILY_BODYFAT" as const;
export const LOAD_EDIT_HEALTH_DAILY_BODYFAT =
  "LOAD_EDIT_HEALTH_DAILY_BODYFAT" as const;

// Health Daily Water - Edit daily water intake entries
export const FETCH_EDIT_HEALTH_DAILY_WATER =
  "FETCH_EDIT_HEALTH_DAILY_WATER" as const;
export const LOAD_EDIT_HEALTH_DAILY_WATER =
  "LOAD_EDIT_HEALTH_DAILY_WATER" as const;

// Health Daily Calories - Edit daily calorie intake entries
export const FETCH_EDIT_HEALTH_DAILY_CALORIES =
  "FETCH_EDIT_HEALTH_DAILY_CALORIES" as const;
export const LOAD_EDIT_HEALTH_DAILY_CALORIES =
  "LOAD_EDIT_HEALTH_DAILY_CALORIES" as const;

// Health Daily Sleep - Edit daily sleep duration entries
export const FETCH_EDIT_HEALTH_DAILY_SLEEP =
  "FETCH_EDIT_HEALTH_DAILY_SLEEP" as const;
export const LOAD_EDIT_HEALTH_DAILY_SLEEP =
  "LOAD_EDIT_HEALTH_DAILY_SLEEP" as const;

// Health Diet Logs Latest - Fetch the most recent diet log entries
export const FETCH_HEALTH_DIET_LOGS_LATEST =
  "FETCH_HEALTH_DIET_LOGS_LATEST" as const;
export const LOAD_HEALTH_DIET_LOGS_LATEST =
  "LOAD_HEALTH_DIET_LOGS_LATEST" as const;

// Apps - Fetch and manage application list
export const FETCH_APPS = "FETCH_APPS" as const;
export const LOAD_APPS = "LOAD_APPS" as const;

// Diet Logs - Fetch and manage diet log entries
export const FETCH_DIET_LOGS = "FETCH_DIET_LOGS" as const;
export const LOAD_DIET_LOGS = "LOAD_DIET_LOGS" as const;

// Diet Log Edit - Edit individual diet log entries
export const FETCH_EDIT_DIET_LOG = "FETCH_EDIT_DIET_LOG" as const;
export const LOAD_EDIT_DIET_LOG = "LOAD_EDIT_DIET_LOG" as const;

// Diet Log Delete - Delete individual diet log entries
export const FETCH_DELETE_DIET_LOG = "FETCH_DELETE_DIET_LOG" as const;
export const LOAD_DELETE_DIET_LOG = "LOAD_DELETE_DIET_LOG" as const;

// Check-ins - Fetch and manage check-in entries
export const FETCH_CHECKINS = "FETCH_CHECKINS" as const;
export const LOAD_CHECKINS = "LOAD_CHECKINS" as const;

// Check-in Edit - Edit individual check-in entries
export const FETCH_EDIT_CHECKIN = "FETCH_EDIT_CHECKIN" as const;
export const LOAD_EDIT_CHECKIN = "LOAD_EDIT_CHECKIN" as const;

// Check-in Delete - Delete individual check-in entries
export const FETCH_DELETE_CHECKIN = "FETCH_DELETE_CHECKIN" as const;
export const LOAD_DELETE_CHECKIN = "LOAD_DELETE_CHECKIN" as const;

// Check-in Attachments - Fetch and manage check-in photo attachments
export const FETCH_CHECKIN_ATTACHMENTS = "FETCH_CHECKIN_ATTACHMENTS" as const;
export const LOAD_CHECKIN_ATTACHMENTS = "LOAD_CHECKIN_ATTACHMENTS" as const;

// Assign Check-in Pose - Assign pose labels to check-in attachments
export const FETCH_ASSIGN_CHECKIN_POSE = "FETCH_ASSIGN_CHECKIN_POSE" as const;
export const LOAD_ASSIGN_CHECKIN_POSE = "LOAD_ASSIGN_CHECKIN_POSE" as const;

// Check-in Comments - Fetch and manage comments on check-in entries
export const FETCH_CHECKIN_COMMENTS = "FETCH_CHECKIN_COMMENTS" as const;
export const LOAD_CHECKIN_COMMENTS = "LOAD_CHECKIN_COMMENTS" as const;

// Add Check-in Comment - Post a new comment to a check-in
export const FETCH_ADD_CHECKIN_COMMENT = "FETCH_ADD_CHECKIN_COMMENT" as const;
export const LOAD_ADD_CHECKIN_COMMENT = "LOAD_ADD_CHECKIN_COMMENT" as const;

// Send Check-in Email - Send check-in data via email
export const FETCH_SEND_CHECKIN_EMAIL = "FETCH_SEND_CHECKIN_EMAIL" as const;
export const LOAD_SEND_CHECKIN_EMAIL = "LOAD_SEND_CHECKIN_EMAIL" as const;

// Physique Pose Analysis - Analyze pose from uploaded image
export const FETCH_ANALYZE_POSE = "FETCH_ANALYZE_POSE" as const;
export const LOAD_ANALYZE_POSE = "LOAD_ANALYZE_POSE" as const;

// Physique Pose Assignment - Assign pose classification to an image
export const FETCH_ASSIGN_PHYSIQUE_POSE = "FETCH_ASSIGN_PHYSIQUE_POSE" as const;
export const LOAD_ASSIGN_PHYSIQUE_POSE = "LOAD_ASSIGN_PHYSIQUE_POSE" as const;

// Physique Poses - Fetch available poses for physique classification
export const FETCH_PHYSIQUE_POSES = "FETCH_PHYSIQUE_POSES" as const;
export const LOAD_PHYSIQUE_POSES = "LOAD_PHYSIQUE_POSES" as const;

// Physique Pose Training Photos - Fetch training and check-in photos
export const FETCH_PHYSIQUE_POSE_TRAINING_PHOTOS = "FETCH_PHYSIQUE_POSE_TRAINING_PHOTOS" as const;
export const LOAD_PHYSIQUE_POSE_TRAINING_PHOTOS = "LOAD_PHYSIQUE_POSE_TRAINING_PHOTOS" as const;

// Physique Pose Model Data - Fetch model statistics and information
export const FETCH_PHYSIQUE_POSE_MODEL_DATA = "FETCH_PHYSIQUE_POSE_MODEL_DATA" as const;
export const LOAD_PHYSIQUE_POSE_MODEL_DATA = "LOAD_PHYSIQUE_POSE_MODEL_DATA" as const;
