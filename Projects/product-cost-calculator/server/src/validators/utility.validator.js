import { body } from "express-validator";

export const createUtilityValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("cost_per_unit")
    .isFloat({ min: 0 })
    .withMessage("Cost per unit must be a positive number"),
  body("unit_type")
    .notEmpty()
    .withMessage("Unit type is required")
    .trim()
    .escape(),
];

export const updateUtilityValidator = [
  body("name").optional().isString().trim().escape(),
  body("cost_per_unit").optional().isFloat({ min: 0 }),
  body("unit_type").optional().isString().trim().escape(),
];
