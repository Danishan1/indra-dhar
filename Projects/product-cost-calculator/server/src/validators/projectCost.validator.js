import { body } from "express-validator";

export const createProjectCostValidator = [
  body("meta.project_name")
    .notEmpty()
    .isString()
    .withMessage("Project name is required")
    .trim()
    .escape(),
  body("meta.profit_value")
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("profit value is Required is required")
    .trim()
    .escape(),
  body("meta.profit_type")
    .notEmpty()
    .isIn(["Fixed", "Percentage"])
    .withMessage("Profit type is required")
    .trim()
    .escape(),
  body("meta.project_gst")
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("GST Amount is required")
    .trim()
    .escape(),
  body("meta.project_progress")
    .optional()
    .isIn(["Planned", "Completed", "In-Active", "Active"])
    .withMessage("Project Progress is required")
    .trim()
    .escape(),
  body("meta.product_type")
    .optional()
    .isIn(["Finished", "Semi Finished", "Raw Material"])
    .withMessage("Project Progress is required")
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
