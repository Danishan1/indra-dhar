import { SIDEBAR_CONFIG } from "./sidebar.config";
const { ICON_SIZE, icons, items, groups, roleConfig } = SIDEBAR_CONFIG;

function buildItem(key) {
  const item = items[key];
  const Icon = icons[item.icon];

  return {
    name: item.name,
    path: item.path,
    icon: <Icon size={ICON_SIZE} />,
  };
}

function buildGroup(groupKey, role) {
  const group = groups[groupKey];
  const Icon = icons[group.icon];
  const overrides = roleConfig[role][groupKey] || {};

  const children = [
    ...group.children.filter((key) => !overrides.remove?.includes(key)),
    ...(overrides.add || []),
  ].map(buildItem);

  return {
    name: group.name,
    icon: <Icon size={ICON_SIZE} />,
    children,
  };
}

export const menuItems = Object.fromEntries(
  Object.entries(roleConfig).map(([role, config]) => [
    role,
    config.groups.map((group) => buildGroup(group, role)),
  ]),
);

export default menuItems;
