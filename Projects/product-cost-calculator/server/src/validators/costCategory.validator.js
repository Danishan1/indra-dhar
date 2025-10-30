// // validators/costCategory.validator.js
// import { body } from "express-validator";

// export const createCategoryValidator = [
//   body("name").notEmpty().withMessage("Name is required").trim().escape(),
//   body("code")
//     .notEmpty()
//     .withMessage("Code is required")
//     .isLength({ max: 100 })
//     .trim()
//     .escape(),
//   body("cost_type")
//     .isIn(["direct", "indirect"])
//     .withMessage("Invalid cost type"),
//   body("allocation_basis")
//     .optional()
//     .isIn(["batch", "machine_hours", "labor_hours", "units_produced", "custom"])
//     .withMessage("Invalid allocation basis"),
// ];

// export const updateCategoryValidator = [
//   body("name").optional().isString().trim().escape(),
//   body("allocation_basis")
//     .optional()
//     .isIn(["batch", "machine_hours", "labor_hours", "units_produced", "custom"])
//     .withMessage("Invalid allocation basis"),
// ];
