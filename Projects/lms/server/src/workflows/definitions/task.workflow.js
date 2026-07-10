import { WORKFLOW_ACTIONS } from "./workflow.action.js";
import { WORKFLOW_EVENTS } from "./workflow.events.js";

export const TaskWorkflows = [
  /**
   * Lead Created
   * Create first follow-up task
   */
  {
    key: "NEW_LEAD_FOLLOW_UP",

    name: "New Lead Follow Up",

    description:
      "Automatically create a follow-up task when a new lead is created.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_CREATED,

    settings: [
      {
        key: "title",
        type: "text",
        default: "Follow up with customer",
      },
      {
        key: "description",
        type: "textarea",
      },
      {
        key: "priority",
        type: "select",
        default: "HIGH",
        options: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      },
      {
        key: "due_days",
        type: "number",
        default: 1,
      },
      {
        key: "task_type_id",
        type: "task_type",
      },
    ],

    conditions: [],

    actions: [
      {
        type: WORKFLOW_ACTIONS.CREATE_TASK,
        config: {
          assigned_to: "lead_owner",
        },
      },
    ],
  },

  /**
   * Qualified Lead
   */
  {
    key: "QUALIFIED_LEAD_TASK",

    name: "Qualified Lead Follow Up",

    description: "Create a follow-up task when a lead becomes qualified.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_STAGE_CHANGED,

    conditions: [
      {
        field: "event.new_stage",
        operator: "=",
        value: "QUALIFIED",
      },
    ],

    settings: [
      {
        key: "due_days",
        type: "number",
        default: 1,
      },
      {
        key: "priority",
        type: "select",
        default: "HIGH",
        options: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      },
    ],

    actions: [
      {
        type: WORKFLOW_ACTIONS.CREATE_FOLLOW_UP_TASK,
        config: {
          title: "Discuss customer requirements",
        },
      },
    ],
  },

  /**
   * Proposal Stage
   */
  {
    key: "PROPOSAL_TASK",

    name: "Proposal Follow Up",

    description: "Create proposal follow-up task.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_STAGE_CHANGED,

    conditions: [
      {
        field: "event.new_stage",
        operator: "=",
        value: "PROPOSAL",
      },
    ],

    actions: [
      {
        type: WORKFLOW_ACTIONS.CREATE_FOLLOW_UP_TASK,
        config: {
          title: "Follow up on proposal",
          priority: "HIGH",
          days: 2,
        },
      },
    ],
  },

  /**
   * Lead Won
   */
  {
    key: "ONBOARDING_TASK",

    name: "Customer Onboarding",

    description: "Create onboarding task after winning a lead.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_WON,

    conditions: [],

    actions: [
      {
        type: WORKFLOW_ACTIONS.CREATE_TASK,
        config: {
          title: "Start customer onboarding",
          priority: "HIGH",
          due_days: 1,
          assigned_to: "lead_owner",
        },
      },
    ],
  },

  /**
   * Lead Lost
   */
  {
    key: "CLOSE_OPEN_TASKS",

    name: "Close Open Tasks",

    description: "Automatically cancel remaining tasks when a lead is lost.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_LOST,

    conditions: [],

    actions: [
      {
        type: WORKFLOW_ACTIONS.CANCEL_TASK,
      },
    ],
  },

  /**
   * Task Completed
   */
  {
    key: "NEXT_FOLLOW_UP",

    name: "Next Follow Up",

    description:
      "Automatically create the next follow-up task after task completion.",

    category: "Task",

    event: WORKFLOW_EVENTS.TASK_COMPLETED,

    conditions: [
      {
        field: "task.outcome",
        operator: "=",
        value: "FOLLOW_UP_REQUIRED",
      },
    ],

    settings: [
      {
        key: "days",
        type: "number",
        default: 2,
      },
    ],

    actions: [
      {
        type: WORKFLOW_ACTIONS.CREATE_FOLLOW_UP_TASK,
        config: {
          title: "Next follow up",
        },
      },
    ],
  },

  /**
   * Overdue Task
   */
  {
    key: "OVERDUE_TASK_REMINDER",

    name: "Overdue Task Reminder",

    description: "Add reminder comment when task becomes overdue.",

    category: "Task",

    event: WORKFLOW_EVENTS.TASK_OVERDUE,

    conditions: [],

    actions: [
      {
        type: WORKFLOW_ACTIONS.ADD_TASK_COMMENT,
        config: {
          comment: "This task is overdue. Please take immediate action.",
        },
      },
    ],
  },
];
