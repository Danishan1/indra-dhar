import { body } from "express-validator";

export const createBomMetaValidator = [
  body("name").notEmpty().withMessage("Name required").trim().escape(),
];
