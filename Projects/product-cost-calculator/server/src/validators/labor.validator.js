import { body } from "express-validator";

export const createLaborValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().escape(),
  body("type")
    .notEmpty()
    .isIn(["direct", "indirect"])
    .withMessage("Type must be either 'direct' or 'indirect'"),
  body("rate_per_hour").isFloat({ min: 0 }).withMessage("Invalid rate per hour"),
  body("overtime_rate").optional().isFloat({ min: 0 }).withMessage("Invalid overtime rate"),
];

export const updateLaborValidator = [
  body("name").optional().isString().trim().escape(),
  body("type").optional().isIn(["direct", "indirect"]),
  body("rate_per_hour").optional().isFloat({ min: 0 }),
  body("overtime_rate").optional().isFloat({ min: 0 }),
];
