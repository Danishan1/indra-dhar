import {
  Users,
  UserSearch,
  Upload,
  Blocks,
  LayoutDashboard,
  Sprout,
  Workflow,
  Handshake,
} from "lucide-react";

import { CONST } from "@/utils/CONST";
import { BASE_PATH } from "@/utils/basePath";

const ICON_SIZE = CONST.ICON_SIZE;

const user = {
  name: "Users",
  icon: <Users size={ICON_SIZE} />,
  path: BASE_PATH.users,
};

const workflows = {
  name: "Workflows",
  icon: <Workflow size={ICON_SIZE} />,
  path: BASE_PATH.workflows,
};

const bulkUpload = {
  name: "Bulk Upload",
  icon: <Upload size={ICON_SIZE} />,
  path: BASE_PATH.bulkUpload,
};

const integrations = {
  name: "Integrations",
  icon: <Blocks size={ICON_SIZE} />,
  path: BASE_PATH.integrations,
};

// Task Management
const taskDashboard = {
  name: "Tasks",
  icon: <LayoutDashboard size={ICON_SIZE} />,
  path: BASE_PATH.taskDashboard,
};

// Lead Management
const leadDashboard = {
  name: "Leads",
  icon: <Sprout size={ICON_SIZE} />,
  path: BASE_PATH.leads,
};

const teams = {
  name: "Teams",
  icon: <Handshake size={ICON_SIZE} />,
  path: BASE_PATH.teams,
};

const dashboard = {
  name: "Dashboard",
  icon: <LayoutDashboard size={ICON_SIZE} />,
  path: BASE_PATH.dashboard,
};

const common = [
  dashboard,
  user,
  teams,
  leadDashboard,
  taskDashboard,
  workflows,
  integrations,
];

export const menuItems = {
  admin: [...common],

  manager: [...common],

  user: [...common],
};

export default menuItems;
