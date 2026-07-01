import {
  Users,
  Upload,
} from "lucide-react";
import { CONST } from "@/utils/CONST";
import { BASE_PATH } from "@/utils/basePath";

const ICON_SIZE = CONST.ICON_SIZE;

const user = {
  name: "Users",
  icon: <Users size={ICON_SIZE} />,
  path: BASE_PATH.users,
};

const buklUpload = {
  name: "Bulk Upload",
  icon: <Upload size={ICON_SIZE} />,
  path: BASE_PATH.bulkUpload,
};

const common = [

  // {
  //   name: "Unit of Measure",
  //   icon: <RulerDimensionLine size={ICON_SIZE} />,
  //   path: BASE_PATH.unit,
  // },

];

export const menuItems = {
  admin: [user, ...common, buklUpload],
  manager: [user, ...common, buklUpload],
  user: common,
};

export default menuItems;
