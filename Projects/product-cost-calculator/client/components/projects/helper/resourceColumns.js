// constants/resourceColumns.js
import { BASE_PATH } from "@/utils/basePath";

const commonColumns = [
  { key: "resource_id", title: "Id" },
  { key: "resource_name", title: "Name" },
];

export const RESOURCE_COLUMNS_MAP = {
  [BASE_PATH.labors]: [
    ...commonColumns,
    { key: "hours", title: "Hours" },
    { key: "overtime_hours", title: "Overtime" },
  ],

  [BASE_PATH.rawMaterial]: [
    ...commonColumns,
    { key: "quantity", title: "Qty" },
    { key: "wastage_percent", title: "Wastage %" },
    { key: "scrap_value", title: "Scrap Value" },
  ],

  // [BASE_PATH.machines]: [
  //   ...commonColumns,
  //   { key: "hours", title: "Hours Used" },
  // ],

  // [BASE_PATH.utilities]: [
  //   ...commonColumns,
  //   { key: "units_consumed", title: "Units" },
  // ],

  [BASE_PATH.overheads]: [
    ...commonColumns,
    { key: "applied_value", title: "Applied Value" },
    { key: "percentage_value", title: "Percentage %" },
  ],
};

export const RESOURCE_ORDER = [
  BASE_PATH.labors,
  BASE_PATH.rawMaterial,
  // BASE_PATH.machines,
  // BASE_PATH.utilities,
  BASE_PATH.overheads,
];

export const filterByType = (list, type) => {
  const rawList = list.filter((item) => item.resource_type === type);
  return rawList.map((r) => r.data);
};
