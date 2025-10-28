// middleware/validateRequest.js
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extracted = errors.array().map((err) => err.msg);
    return next(new ApiError(400, extracted.join(", ")));
  }
  next();
};
