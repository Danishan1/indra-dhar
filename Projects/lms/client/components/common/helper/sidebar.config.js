import {
  Blocks,
  ClipboardList,
  ClipboardPen,
  LayoutDashboard,
  ListTodo,
  Magnet,
  Settings,
  Upload,
  UserSearch,
  Users,
  Sprout,
} from "lucide-react";

import { CONST } from "@/utils/CONST";
import { BASE_PATH } from "@/utils/basePath";

const ICON_SIZE = CONST.ICON_SIZE;

const icons = {
  Users,
  UserSearch,
  Upload,
  Blocks,
  Magnet,
  Settings,
  ListTodo,
  LayoutDashboard,
  ClipboardList,
  ClipboardPen,
  Sprout,
};

/**
 * Leaf menu items
 */
const items = {
  users: {
    name: "Users",
    path: BASE_PATH.users,
    icon: "Users",
  },
  leads: {
    name: "Leads",
    path: BASE_PATH.leads,
    icon: "UserSearch",
  },
  bulkUpload: {
    name: "Bulk Upload",
    path: BASE_PATH.bulkUpload,
    icon: "Upload",
  },
  integrations: {
    name: "Integrations",
    path: BASE_PATH.integrations,
    icon: "Blocks",
  },

  // Task Management
  taskDashboard: {
    name: "Tasks",
    path: BASE_PATH.taskDashboard,
    icon: "LayoutDashboard",
  },

  taskList: {
    name: "Task List",
    path: BASE_PATH.taskList,
    icon: "ListTodo",
  },

  taskDetails: {
    name: "Task Details",
    path: BASE_PATH.taskDetails,
    icon: "ClipboardList",
  },

  taskCreate: {
    name: "Create / Edit Task",
    path: BASE_PATH.taskCreate,
    icon: "ClipboardPen",
  },

  // Task Management
  leadDashboard: {
    name: "Leads",
    path: BASE_PATH.leads,
    icon: "LayoutDashboard",
  },
};

/**
 * Groups with their default children.
 */
const groups = {
  management: {
    name: "Management",
    icon: "Magnet",
    children: ["users", "bulkUpload"],
  },
  settings: {
    name: "Settings",
    icon: "Settings",
    children: ["integrations"],
  },

  tasks: {
    name: "Task Management",
    icon: "ListTodo",
    children: ["taskDashboard"],
  },

  leads: {
    name: "Lead Management",
    icon: "Sprout",
    children: ["leadDashboard"],
  },
};

/**
 * Only define differences from the defaults.
 */
const roleConfig = {
  admin: {
    groups: ["management", "settings", "leads", "tasks"],
  },

  manager: {
    groups: ["management"],

    management: {
      remove: ["bulkUpload"],
      // add: ["leads"],
    },
  },

  user: {
    groups: [],
  },
};

export const SIDEBAR_CONFIG = {
  ICON_SIZE,
  icons,
  items,
  groups,
  roleConfig,
};
