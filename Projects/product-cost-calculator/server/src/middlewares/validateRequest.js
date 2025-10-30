// middleware/validateRequest.js
import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extracted = errors.array().map((err) => err.msg);
    const message = extracted.join(", ")

    return res.status(400).json({
      success: false,
      message: message,
    });
  }
  next();
};
