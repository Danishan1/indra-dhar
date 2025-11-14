import { body } from "express-validator";

export const createProjectCostValidator = [
  body("meta.project_name")
    .notEmpty()
    .withMessage("Project name is required")
    .trim()
    .escape(),

  body("data").isArray({ min: 1 }).withMessage("Items array is required"),

  body("data.*.resource_type")
    .notEmpty()
    .withMessage("Resource type is required"),

  body("data.*.data.resource_id")
    .isInt()
    .withMessage("Resource ID is required"),
];
