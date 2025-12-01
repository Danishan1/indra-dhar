import { BASE_PATH } from "@/utils/basePath";

export const getFilterList = (pathname) => {
  const basePath = `/${pathname.split("/")[1]}`;

  const filterMap = {
    [BASE_PATH.labors]: [{ key: "name", label: "Name", type: "text" }],
    [BASE_PATH.machines]: [{ key: "name", label: "Name", type: "text" }],
    [BASE_PATH.overheads]: [
      { key: "name", label: "Name", type: "text" },
      { key: "type", label: "Type", type: "text" },
      { key: "frequency", label: "Frequency", type: "text" },
    ],
    [BASE_PATH.users]: [
      { key: "name", label: "Name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "role", label: "Role", type: "text" },
    ],
    [BASE_PATH.utilities]: [
      { key: "name", label: "Name", type: "text" },
      { key: "unit_type", label: "unit Type", type: "text" },
    ],
    [BASE_PATH.rawMaterial]: [
      { key: "name", label: "Name", type: "text" },
      { key: "unit_type", label: "unit Type", type: "text" },
    ],

    [BASE_PATH.projects]: [{ key: "project_name", label: "Name", type: "text" }],
  };

  return [
    ...(filterMap[basePath] || []),
    { key: "limit", label: "Limit", type: "text" },
    { key: "offset", label: "Offset", type: "text" },
  ];
};

/*

labor: name,
machine: name, 
overhead: type, frequency, name
user: role | email, name  
utility: name, unit_type
rawMaterial: name, unit_type

----

limit, offset in all 

*/
