import { Upload, Users, Magnet } from "lucide-react";
import { CONST } from "@/utils/CONST";
import { BASE_PATH } from "@/utils/basePath";

const ICON_SIZE = CONST.ICON_SIZE;

const user = {
  name: "Users",
  path: BASE_PATH.users,
  icon: <Users size={ICON_SIZE} />,
};

const bulkUpload = {
  name: "Bulk Upload",
  path: BASE_PATH.bulkUpload,
  icon: <Upload size={ICON_SIZE} />,
};

const management = {
  name: "Management",
  icon: <Magnet size={ICON_SIZE} />,
  children: [user, bulkUpload],
};

export const menuItems = {
  admin: [management, user],
  manager: [management],
  user: [],
};

export default menuItems;
