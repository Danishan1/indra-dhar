import { TaskService } from "../../services/task.service";
import { WORKFLOW_ACTIONS } from "../definitions/workflow.action";
import { WORKFLOW_EVENTS } from "../definitions/workflow.events";

/**
 * CREATE_TASK
 * Create a new task for a lead
 */
async function createTaskAction({ tenant_id, config, payload }) {
  const lead = payload.lead;

  const assignedTo =
    config.assigned_to === "lead_owner" ? lead.assigned_to : config.assigned_to;

  return TaskService.create({
    tenant_id,
    lead_id: lead.id,
    assigned_to: assignedTo,
    task_type_id: config.task_type_id,
    title: config.title,
    description: config.description,
    priority: config.priority || "MEDIUM",
    due_date: calculateDueDate(config.due_days),
    created_by: payload.user_id,
  });
}

/**
 * ASSIGN_TASK
 * Change task assignee
 */
async function assignTaskAction({ config, payload }) {
  return TaskService.assign(payload.task.id, config.user_id, payload.user_id);
}

/**
 * UPDATE_TASK
 * Update task fields
 */
async function updateTaskAction({ config, payload }) {
  return TaskService.update(payload.task.id, config.fields);
}

/**
 * CHANGE_TASK_STATUS
 * Move task state
 */
async function changeTaskStatusAction({ config, payload }) {
  return TaskService.changeStatus(
    payload.task.id,
    config.status,
    payload.user_id,
  );
}

/**
 * COMPLETE_TASK
 * Complete a task
 */
async function completeTaskAction({ payload }) {
  return TaskService.changeStatus(
    payload.task.id,
    "COMPLETED",
    payload.user_id,
  );
}

/**
 * CANCEL_TASK
 * Cancel a task
 */
async function cancelTaskAction({ payload }) {
  return TaskService.changeStatus(
    payload.task.id,
    "CANCELLED",
    payload.user_id,
  );
}

/**
 * ADD_TASK_COMMENT
 * Add automated note/comment
 */
async function addTaskCommentAction({ config, payload }) {
  return TaskService.addComment(
    payload.task.id,
    config.comment,
    payload.user_id,
  );
}

/**
 * CREATE_FOLLOW_UP_TASK
 * Shortcut action for follow-ups
 */
async function createFollowUpTaskAction({ tenant_id, config, payload }) {
  return createTaskAction({
    tenant_id,
    payload,
    config: {
      title: config.title || "Follow up with customer",
      description: config.description,
      priority: config.priority || "HIGH",
      assigned_to: "lead_owner",
      due_days: config.days || 1,
    },
  });
}

/**
 * Helper
 */
function calculateDueDate(days = 1) {
  return new Date(Date.now() + days * 86400000);
}

/**
 * Task Action Registry
 */
export const TaskActions = {
  [WORKFLOW_ACTIONS.CREATE_TASK]: createTaskAction,
  [WORKFLOW_ACTIONS.ASSIGN_TASK]: assignTaskAction,
  [WORKFLOW_ACTIONS.UPDATE_TASK]: updateTaskAction,
  [WORKFLOW_ACTIONS.CHANGE_TASK_STATUS]: changeTaskStatusAction,
  [WORKFLOW_ACTIONS.COMPLETE_TASK]: completeTaskAction,
  [WORKFLOW_ACTIONS.CANCEL_TASK]: cancelTaskAction,
  [WORKFLOW_ACTIONS.ADD_TASK_COMMENT]: addTaskCommentAction,
  [WORKFLOW_ACTIONS.CREATE_FOLLOW_UP_TASK]: createFollowUpTaskAction,
};
