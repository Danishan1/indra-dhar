import { body } from "express-validator";

export const createMaterialValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("unit_type").notEmpty().withMessage("Unit type is required").trim().escape(),
  body("unit_price").isFloat({ min: 0 }).withMessage("Invalid unit price"),
  body("stock_quantity").optional().isFloat({ min: 0 }),
  body("reorder_level").optional().isFloat({ min: 0 }),
  body("vendor_id").optional().isInt({ min: 1 }).withMessage("Invalid vendor ID"),
];

export const updateMaterialValidator = [
  body("name").optional().isString().trim().escape(),
  body("unit_type").optional().isString().trim().escape(),
  body("unit_price").optional().isFloat({ min: 0 }),
  body("stock_quantity").optional().isFloat({ min: 0 }),
  body("reorder_level").optional().isFloat({ min: 0 }),
  body("vendor_id").optional().isInt({ min: 1 }),
];
