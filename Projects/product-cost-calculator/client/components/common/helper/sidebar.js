import {
  Home,
  Users,
  Settings,
  Package,
  Boxes,
  Factory,
  Truck,
  Hammer,
  Wrench,
  Zap,
  Workflow,
  ClipboardList,
} from "lucide-react";
import { CONST } from "@/utils/CONST";
import { BASE_PATH } from "@/utils/basePath";

const ICON_SIZE = CONST.ICON_SIZE;

const adminExtra = [
  {
    name: "Users",
    icon: <Users size={ICON_SIZE} />,
    path: BASE_PATH.users,
  },
];

const common = [
  // {
  //   name: "Dashboard",
  //   icon: <Home size={ICON_SIZE} />,
  //   path: BASE_PATH.dashboard,
  // },

  // {
  //   name: "Products",
  //   icon: <Boxes size={ICON_SIZE} />,
  //   path: BASE_PATH.products,
  // },
  // {
  //   name: "Vendors",
  //   icon: <Truck size={ICON_SIZE} />,
  //   path: BASE_PATH.vendors,
  // },
  {
    name: "Raw Materials",
    icon: <Package size={ICON_SIZE} />,
    path: BASE_PATH.rawMaterial,
  },
  {
    name: "Labors",
    icon: <Hammer size={ICON_SIZE} />,
    path: BASE_PATH.labors,
  },
  {
    name: "Machines",
    icon: <Factory size={ICON_SIZE} />,
    path: BASE_PATH.machines,
  },
  {
    name: "Overheads",
    icon: <Wrench size={ICON_SIZE} />,
    path: BASE_PATH.overheads,
  },
  {
    name: "Utilities",
    icon: <Zap size={ICON_SIZE} />,
    path: BASE_PATH.utilities,
  },
  // {
  //   name: "Batches",
  //   icon: <Workflow size={ICON_SIZE} />,
  //   path: BASE_PATH.batches,
  // },
  {
    name: "Projects",
    icon: <ClipboardList size={ICON_SIZE} />,
    path: BASE_PATH.projects,
  },
  // {
  //   name: "Settings",
  //   icon: <Settings size={ICON_SIZE} />,
  //   path: BASE_PATH.settings,
  // },
];

export const menuItems = {
  admin: [...adminExtra, ...common],
  manager: [...adminExtra, ...common],
  user: common,
};

export default menuItems;
