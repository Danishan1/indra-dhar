// import { body } from "express-validator";

// export const createAllocationValidator = [
//   body("category_id").isInt({ min: 1 }).withMessage("Category ID is required"),
//   body("allocation_basis")
//     .isIn([
//       "machine_hours",
//       "labor_hours",
//       "units_produced",
//       "revenue_share",
//       "custom_formula",
//     ])
//     .withMessage("Invalid allocation basis"),
//   body("allocation_percentage")
//     .optional()
//     .isFloat({ min: 0, max: 100 })
//     .withMessage("Percentage must be between 0 and 100"),
//   body("formula_expression").optional().isString().trim(),
// ];

// export const updateAllocationValidator = [
//   body("allocation_basis")
//     .optional()
//     .isIn([
//       "machine_hours",
//       "labor_hours",
//       "units_produced",
//       "revenue_share",
//       "custom_formula",
//     ])
//     .withMessage("Invalid allocation basis"),
//   body("allocation_percentage")
//     .optional()
//     .isFloat({ min: 0, max: 100 })
//     .withMessage("Percentage must be between 0 and 100"),
//   body("formula_expression").optional().isString().trim(),
// ];
