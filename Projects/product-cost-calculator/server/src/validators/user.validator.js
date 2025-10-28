import { body } from "express-validator";

export const createUserValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
  body("role")
    .optional()
    .isIn(["admin", "manager", "user"])
    .withMessage("Invalid role"),
];

export const updateUserValidator = [
  body("name").optional().isString().trim().escape(),
  body("email").optional().isEmail().normalizeEmail(),
  body("role")
    .optional()
    .isIn(["admin", "manager", "user"])
    .withMessage("Invalid role"),
  body("status").optional().isIn(["active", "inactive"]),
];

export const updatePasswordValidator = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
];
