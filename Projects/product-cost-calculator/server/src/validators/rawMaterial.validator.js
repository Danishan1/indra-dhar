import { body } from "express-validator";

export const createMaterialValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("unit_type_id")
    .isInt({ min: 1 })
    .withMessage("Valid unit type is required"),
  body("unit_price").isFloat({ min: 0 }).withMessage("Invalid unit price"),
  body("gst").optional().isFloat({ min: 0 }).withMessage("Invalid gst"),
  body("is_gst_itc").optional().isBoolean(),
];

export const updateMaterialValidator = [
  body("name").optional().isString().trim().escape(),
  body("unit_type_id").optional().isInt({ min: 1 }),
  body("unit_price").optional().isFloat({ min: 0 }),
  body("gst").optional().isFloat({ min: 0 }),
  body("is_gst_itc").optional().isBoolean(),
];

export const createMaterialBulkValidator = [
  body()
    .isArray({ min: 1 })
    .withMessage("Request body must be a non-empty array"),
  body("*.name").notEmpty().trim().escape(),
  body("*.unit_type_id").isInt({ min: 1 }),
  body("*.unit_price").isFloat({ min: 0 }),
  body("*.gst").optional().isFloat({ min: 0 }),
  body("*.is_gst_itc").optional().isBoolean(),
];
