// // validators/costItem.validator.js
// import { body } from "express-validator";

// export const createItemValidator = [
//   body("category_id").isInt({ min: 1 }).withMessage("Category ID is required"),
//   body("name").notEmpty().withMessage("Name is required").trim().escape(),
//   body("unit_type").optional().isString().trim().escape(),
//   body("default_rate")
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage("Invalid rate"),
//   body("vendor_id").optional().isInt().withMessage("Invalid vendor ID"),
//   body("is_variable").optional().isBoolean(),
// ];

// export const updateItemValidator = [
//   body("name").optional().isString().trim().escape(),
//   body("default_rate").optional().isFloat({ min: 0 }),
//   body("unit_type").optional().isString().trim().escape(),
// ];
