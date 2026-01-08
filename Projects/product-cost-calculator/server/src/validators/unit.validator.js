import { body } from "express-validator";

export const createUnitValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("unit_code")
    .notEmpty()
    .withMessage("Unit code is required")
    .trim()
    .escape(),
  body("base_unit")
    .notEmpty()
    .withMessage("Base unit is required")
    .trim()
    .escape(),
  body("decimal_allowed").optional().isBoolean(),
];

export const bulkCreateUnitValidator = [
  body().isArray({ min: 1 }).withMessage("Units array is required"),
  body("*.name").notEmpty().trim().escape(),
  body("*.unit_code").notEmpty().trim().escape(),
  body("*.base_unit").notEmpty().trim().escape(),
  body("*.decimal_allowed").optional().isBoolean(),
];

export const updateUnitValidator = [
  body("name").optional().isString().trim().escape(),
  body("unit_code").optional().isString().trim().escape(),
  body("base_unit").optional().isString().trim().escape(),
  body("decimal_allowed").optional().isBoolean(),
];
