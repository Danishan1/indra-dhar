import { body } from "express-validator";

export const createMachineValidator = [
  body("name")
    .notEmpty()
    .withMessage("Machine name is required")
    .trim()
    .escape(),
  body("cost_per_hour")
    .isFloat({ min: 0 })
    .withMessage("Cost per hour must be a positive number"),
  body("maintenance_cost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Invalid maintenance cost"),
];

export const updateMachineValidator = [
  body("name").optional().isString().trim().escape(),
  body("cost_per_hour").optional().isFloat({ min: 0 }),
  body("maintenance_cost").optional().isFloat({ min: 0 }),
];
