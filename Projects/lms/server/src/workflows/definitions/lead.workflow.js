import { WORKFLOW_ACTIONS } from "./workflow.action.js";
import { WORKFLOW_EVENTS } from "./workflow.events.js";

export const LeadWorkflows = [
  /**
   * Auto Assign New Lead
   */
  {
    key: "AUTO_ASSIGN_NEW_LEAD",

    name: "Auto Assign New Lead",

    description: "Automatically assign newly created leads.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_CREATED,

    settings: [
      {
        key: "user_id",
        label: "Assign To",
        type: "user",
      },
    ],

    conditions: [],

    actions: [
      {
        type: WORKFLOW_ACTIONS.ASSIGN_LEAD,
      },
    ],
  },

  /**
   * Mark Lead Contacted
   */
  {
    key: "AUTO_MARK_CONTACTED",

    name: "Mark Lead as Contacted",

    description: "Move lead to Contacted when first task is completed.",

    category: "Lead",

    event: WORKFLOW_EVENTS.TASK_COMPLETED,

    conditions: [
      {
        field: "lead.stage",
        operator: "=",
        value: "NEW",
      },
    ],

    actions: [
      {
        type: WORKFLOW_ACTIONS.CHANGE_LEAD_STAGE,
        config: {
          stage: "CONTACTED",
        },
      },
    ],
  },

  /**
   * Add Qualified Note
   */
  {
    key: "QUALIFIED_NOTE",

    name: "Add Qualified Note",

    description: "Automatically add a note when a lead becomes qualified.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_STAGE_CHANGED,

    conditions: [
      {
        field: "event.new_stage",
        operator: "=",
        value: "QUALIFIED",
      },
    ],

    actions: [
      {
        type: WORKFLOW_ACTIONS.ADD_LEAD_NOTE,
        config: {
          note: "Lead qualified by automation.",
        },
      },
    ],
  },

  /**
   * Auto Close Won Lead
   */
  {
    key: "AUTO_CLOSE_WON",

    name: "Close Won Lead",

    description: "Close lead when moved to Won.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_WON,

    conditions: [],

    actions: [
      {
        type: WORKFLOW_ACTIONS.CLOSE_LEAD,
        config: {
          stage: "WON",
        },
      },
    ],
  },

  /**
   * Auto Close Lost Lead
   */
  {
    key: "AUTO_CLOSE_LOST",

    name: "Close Lost Lead",

    description: "Close lead when marked Lost.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_LOST,

    conditions: [],

    actions: [
      {
        type: WORKFLOW_ACTIONS.CLOSE_LEAD,
        config: {
          stage: "LOST",
        },
      },
    ],
  },

  /**
   * Reopen Lead
   */
  {
    key: "REOPEN_LEAD",

    name: "Reopen Lead",

    description: "Automatically reopen a closed lead.",

    category: "Lead",

    event: WORKFLOW_EVENTS.LEAD_REOPENED,

    conditions: [],

    actions: [
      {
        type: WORKFLOW_ACTIONS.REOPEN_LEAD,
      },
    ],
  },

  /**
   * Mark Duplicate
   */
  {
    key: "MARK_DUPLICATE_LEAD",

    name: "Mark Duplicate Lead",

    description: "Mark detected duplicate leads.",

    category: "Lead",

    event: WORKFLOW_EVENTS.DUPLICATE_LEAD_FOUND,

    conditions: [],

    actions: [
      {
        type: WORKFLOW_ACTIONS.MARK_DUPLICATE,
      },
    ],
  },
];
