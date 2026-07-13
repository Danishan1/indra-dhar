export const WORKFLOW_CATALOG = [
  /**
   * =====================================================
   * Lead Workflows
   * =====================================================
   */

  {
    key: "AUTO_ASSIGN_NEW_LEAD",
    name: "Auto Assign New Lead",
    description: "Automatically assign newly created leads.",
    category: "Lead",
    event: "LEAD_CREATED",
    settings: [
      {
        key: "user_id",
        label: "Assign To",
        type: "selectRemote",
        endpoint: "/users",
        labelField: "full_name",
        valueField: "id",
      },
    ],
  },

  {
    key: "AUTO_MARK_CONTACTED",
    name: "Mark Lead as Contacted",
    description: "Move lead to Contacted when the first task is completed.",
    category: "Lead",
    event: "TASK_COMPLETED",
    settings: [],
  },

  {
    key: "QUALIFIED_NOTE",
    name: "Qualified Lead Note",
    description: "Automatically add a note when a lead becomes qualified.",
    category: "Lead",
    event: "LEAD_STAGE_CHANGED",
    settings: [],
  },

  {
    key: "AUTO_CLOSE_WON",
    name: "Close Won Lead",
    description: "Automatically close a lead when it is marked as won.",
    category: "Lead",
    event: "LEAD_WON",
    settings: [],
  },

  {
    key: "AUTO_CLOSE_LOST",
    name: "Close Lost Lead",
    description: "Automatically close a lead when it is marked as lost.",
    category: "Lead",
    event: "LEAD_LOST",
    settings: [],
  },

  {
    key: "REOPEN_LEAD",
    name: "Reopen Lead",
    description: "Automatically reopen a closed lead.",
    category: "Lead",
    event: "LEAD_REOPENED",
    settings: [],
  },

  {
    key: "MARK_DUPLICATE_LEAD",
    name: "Mark Duplicate Lead",
    description: "Automatically mark duplicate leads.",
    category: "Lead",
    event: "DUPLICATE_LEAD_FOUND",
    settings: [],
  },

  /**
   * =====================================================
   * Task Workflows
   * =====================================================
   */

  {
    key: "NEW_LEAD_FOLLOW_UP",
    name: "New Lead Follow Up",
    description: "Create a follow-up task when a new lead is created.",
    category: "Task",
    event: "LEAD_CREATED",
    settings: [
      {
        key: "title",
        label: "Task Title",
        type: "text",
        default: "Follow up with customer",
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
      },
      {
        key: "priority",
        label: "Priority",
        type: "select",
        default: "HIGH",
        options: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      },
      {
        key: "due_days",
        label: "Due In (Days)",
        type: "number",
        default: 1,
      },
    ],
  },

  {
    key: "QUALIFIED_LEAD_TASK",
    name: "Qualified Lead Follow Up",
    description: "Create a follow-up task when a lead becomes qualified.",
    category: "Task",
    event: "LEAD_STAGE_CHANGED",
    settings: [
      {
        key: "days",
        label: "Due In (Days)",
        type: "number",
        default: 1,
      },
      {
        key: "priority",
        label: "Priority",
        type: "select",
        default: "HIGH",
        options: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      },
    ],
  },

  {
    key: "PROPOSAL_TASK",
    name: "Proposal Follow Up",
    description: "Create a proposal follow-up task.",
    category: "Task",
    event: "LEAD_STAGE_CHANGED",
    settings: [
      {
        key: "days",
        label: "Due In (Days)",
        type: "number",
        default: 2,
      },
      {
        key: "priority",
        label: "Priority",
        type: "select",
        default: "HIGH",
        options: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      },
    ],
  },

  {
    key: "ONBOARDING_TASK",
    name: "Customer Onboarding",
    description: "Create an onboarding task after a lead is won.",
    category: "Task",
    event: "LEAD_WON",
    settings: [
      {
        key: "title",
        label: "Task Title",
        type: "text",
        default: "Start customer onboarding",
      },
      {
        key: "priority",
        label: "Priority",
        type: "select",
        default: "HIGH",
        options: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      },
      {
        key: "due_days",
        label: "Due In (Days)",
        type: "number",
        default: 1,
      }
    ],
  },

  {
    key: "CLOSE_OPEN_TASKS",
    name: "Close Open Tasks",
    description: "Automatically cancel open tasks when a lead is lost.",
    category: "Task",
    event: "LEAD_LOST",
    settings: [],
  },

  {
    key: "NEXT_FOLLOW_UP",
    name: "Next Follow Up",
    description:
      "Automatically create another follow-up task after completion.",
    category: "Task",
    event: "TASK_COMPLETED",
    settings: [
      {
        key: "days",
        label: "Next Follow Up In (Days)",
        type: "number",
        default: 2,
      },
    ],
  },

  {
    key: "OVERDUE_TASK_REMINDER",
    name: "Overdue Task Reminder",
    description: "Automatically add a reminder comment when a task is overdue.",
    category: "Task",
    event: "TASK_OVERDUE",
    settings: [],
  },
];
