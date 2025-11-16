import { body } from "express-validator";

export const createMaterialValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("unit_type")
    .notEmpty()
    .withMessage("Unit type is required")
    .trim()
    .escape(),
  body("unit_price").isFloat({ min: 0 }).withMessage("Invalid unit price"),
];

export const updateMaterialValidator = [
  body("name").optional().isString().trim().escape(),
  body("unit_type").optional().isString().trim().escape(),
  body("unit_price").optional().isFloat({ min: 0 }),
];

export const createMaterialBulkValidator = [
  body()
    .isArray({ min: 1 })
    .withMessage("Request body must be a non-empty array"),
  body("*.name").notEmpty().withMessage("Name is required").trim().escape(),
  body("*.unit_type")
    .notEmpty()
    .withMessage("Unit type is required")
    .trim()
    .escape(),
  body("*.unit_price").isFloat({ min: 0 }).withMessage("Invalid unit price"),
];
