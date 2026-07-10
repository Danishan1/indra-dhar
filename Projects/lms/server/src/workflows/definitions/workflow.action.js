export const WORKFLOW_ACTIONS = {
  /*
   |--------------------------------------------------------------------------
   | Lead Actions
   |--------------------------------------------------------------------------
   */

  ASSIGN_LEAD: "ASSIGN_LEAD",
  UPDATE_LEAD: "UPDATE_LEAD",
  CHANGE_LEAD_STAGE: "CHANGE_LEAD_STAGE",
  ADD_LEAD_NOTE: "ADD_LEAD_NOTE",
  CLOSE_LEAD: "CLOSE_LEAD",
  REOPEN_LEAD: "REOPEN_LEAD",
  MARK_DUPLICATE: "MARK_DUPLICATE",

  /*
   |--------------------------------------------------------------------------
   | Task Actions
   |--------------------------------------------------------------------------
   */

  CREATE_TASK: "CREATE_TASK",
  CREATE_FOLLOW_UP_TASK: "CREATE_FOLLOW_UP_TASK",
  ASSIGN_TASK: "ASSIGN_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  CHANGE_TASK_STATUS: "CHANGE_TASK_STATUS",
  COMPLETE_TASK: "COMPLETE_TASK",
  CANCEL_TASK: "CANCEL_TASK",
  ADD_TASK_COMMENT: "ADD_TASK_COMMENT",

  /*
   |--------------------------------------------------------------------------
   | Notification Actions
   |--------------------------------------------------------------------------
   */

  SEND_NOTIFICATION: "SEND_NOTIFICATION",
  SEND_EMAIL: "SEND_EMAIL",
  SEND_SMS: "SEND_SMS",
  SEND_WHATSAPP: "SEND_WHATSAPP",

  /*
   |--------------------------------------------------------------------------
   | Integration Actions
   |--------------------------------------------------------------------------
   */

  CALL_WEBHOOK: "CALL_WEBHOOK",
};
