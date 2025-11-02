import { body } from "express-validator";

export const createOverheadValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("type")
    .isIn(["fixed", "percentage"])
    .withMessage("Type must be either 'fixed' or 'percentage'"),
  body("value")
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number"),
  body("frequency")
    .optional()
    .isIn(["monthly", "annual", "per_batch"])
    .withMessage("Invalid frequency"),
  body("is_global").optional().isBoolean(),
];

export const updateOverheadValidator = [
  body("name").optional().isString().trim().escape(),
  body("type").optional().isIn(["fixed", "percentage"]),
  body("value").optional().isFloat({ min: 0 }),
  body("frequency").optional().isIn(["monthly", "annual", "per_batch"]),
  body("is_global").optional().isBoolean(),
];
