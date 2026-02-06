import { body } from "express-validator";

export const createIndirectExpValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("type")
    .isIn(["fixed", "percentage"])
    .withMessage("Type must be either 'fixed' or 'percentage'"),
  body("value")
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number"),
  body("frequency")
    .optional()
    .isIn(["Monthly", "Yearly", "Per Hour"])
    .withMessage("Invalid frequency"),
];

export const updateIndirectExpValidator = [
  body("name").optional().isString().trim().escape(),
  body("type").optional().isIn(["fixed", "percentage"]),
  body("value").optional().isFloat({ min: 0 }),
  body("frequency").optional().isIn(["Monthly", "Yearly", "Per Hour"]),
];

export const createIndirectExpBulkValidator = [
  body()
    .isArray({ min: 1 })
    .withMessage("Request body must be a non-empty array"),
  body("*.name").notEmpty().withMessage("Name is required").trim().escape(),
  body("*.type")
    .isIn(["fixed", "percentage"])
    .withMessage("Type must be either 'fixed' or 'percentage'"),
  body("*.value")
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number"),
  body("*.frequency")
    .optional()
    .isIn(["Monthly", "Yearly", "Per Hour"])
    .withMessage("Invalid frequency"),
];
