import Joi from "joi";

export const registerSchema = Joi.object({
  tenantName: Joi.string().trim().min(3).max(50).required(),
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "phase_head", "operator").required(),
  phaseId: Joi.string().hex().length(24).optional(),
});

export const loginSchema = Joi.object({
  tenantName: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
});