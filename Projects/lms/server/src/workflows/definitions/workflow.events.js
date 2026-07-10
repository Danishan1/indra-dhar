export const WORKFLOW_EVENTS = {
  /*
   |--------------------------------------------------------------------------
   | Lead Events
   |--------------------------------------------------------------------------
   */

  LEAD_CREATED: "LEAD_CREATED",
  LEAD_UPDATED: "LEAD_UPDATED",
  LEAD_STAGE_CHANGED: "LEAD_STAGE_CHANGED",
  LEAD_ASSIGNED: "LEAD_ASSIGNED",
  LEAD_WON: "LEAD_WON",
  LEAD_LOST: "LEAD_LOST",
  LEAD_REOPENED: "LEAD_REOPENED",
  DUPLICATE_LEAD_FOUND: "DUPLICATE_LEAD_FOUND",

  /*
   |--------------------------------------------------------------------------
   | Task Events
   |--------------------------------------------------------------------------
   */

  TASK_CREATED: "TASK_CREATED",
  TASK_UPDATED: "TASK_UPDATED",
  TASK_ASSIGNED: "TASK_ASSIGNED",
  TASK_COMPLETED: "TASK_COMPLETED",
  TASK_CANCELLED: "TASK_CANCELLED",
  TASK_OVERDUE: "TASK_OVERDUE",

  /*
   |--------------------------------------------------------------------------
   | Scheduled Events
   |--------------------------------------------------------------------------
   */

  NO_ACTIVITY_FOR_N_DAYS: "NO_ACTIVITY_FOR_N_DAYS",
  LEAD_IN_STAGE_FOR_N_DAYS: "LEAD_IN_STAGE_FOR_N_DAYS",
};
