import { body } from "express-validator";

export const createBomItemValidator = [
  body("bom_meta_id")
    .isInt({ min: 1 })
    .withMessage("BOM meta ID must be a valid integer greater than 0"),

  body("material_id")
    .isInt({ min: 1 })
    .withMessage("Material ID must be a valid integer greater than 0"),

  body("quantity").notEmpty().withMessage("Quantity is required"),

  body("decimal_allowed")
    .optional()
    .isBoolean()
    .withMessage("Decimal allowed must be a boolean value"),
];
export const createBomItemBulkValidator = [
  body()
    .isArray({ min: 1 })
    .withMessage("Request body must be a non-empty array"),
  body("*.bom_meta_id")
    .isInt({ min: 1 })
    .withMessage("BOM meta ID must be a valid integer greater than 0"),

  body("*.material_id")
    .isInt({ min: 1 })
    .withMessage("Material ID must be a valid integer greater than 0"),

  body("*.quantity").notEmpty().withMessage("Quantity is required"),

  body("*.decimal_allowed")
    .optional()
    .isBoolean()
    .withMessage("Decimal allowed must be a boolean value"),
];
