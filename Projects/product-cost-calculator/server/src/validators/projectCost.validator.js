import { body } from "express-validator";

export const createProjectCostValidator = [
  body("project_name")
    .notEmpty()
    .withMessage("Project name is required")
    .trim()
    .escape(),

  body("items").isArray({ min: 1 }).withMessage("Items array is required"),

  body("items.*.resource_type")
    .notEmpty()
    .withMessage("Resource type is required"),

  body("items.*.data.resource_id")
    .isInt()
    .withMessage("Resource ID is required"),
];
