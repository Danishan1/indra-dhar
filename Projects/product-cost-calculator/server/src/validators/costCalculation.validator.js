import { body } from "express-validator";

export const calculateCostValidator = [
  body("data")
    .isArray({ min: 1 })
    .withMessage("resources must be a non-empty array"),

  body("data.*.resource_type")
    .isString()
    .withMessage("resource_type is required"),

  body("data.*.data.resource_id")
    .isInt({ min: 1 })
    .withMessage("resource_id is required"),
];
