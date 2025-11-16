import { BASE_PATH } from "./basePath";

const allThree = ["admin", "manager", "user"];
const adminManager = ["admin", "manager"];
const adminOnly = ["admin"];

const CRUD_MODULES = [
  "products",
  "raw-material",
  "labors",
  "machines",
  "overheads",
  "utilities",
];

function generateCrudPermissions(modules) {
  const result = {};

  modules.forEach((mod) => {
    const base = `/${mod}`;

    // Everyone can READ
    result[`${base}/get-list`] = allThree;
    result[`${base}/get`] = allThree;

    // Admin + Manager can write
    result[`${base}/create`] = adminManager;
    result[`${base}/update`] = adminManager;
    result[`${base}/delete`] = adminManager;
  });

  return result;
}

export const routePermissions = {
  // ==========================
  // SPECIAL CASES
  // ==========================
  "/dashboard": allThree,

  // USERS (Special Case 1)
  "/users/create": adminOnly,
  "/users/update": adminOnly,
  "/users/delete": adminOnly,
  "/users/get-list": adminManager,
  "/users/get": adminManager,
  [BASE_PATH.bulkUpload]: adminManager,

  // PROJECTS (Special Case 2)
  "/projects": allThree,

  // ==========================
  // AUTO-GENERATED MODULE CRUD PERMISSIONS
  // ==========================
  ...generateCrudPermissions(CRUD_MODULES),
};
