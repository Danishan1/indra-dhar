import Joi from "joi";

// ---- Phase Validation ----
export const createPhaseSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  order: Joi.number().integer().min(1).required(),
  description: Joi.string().allow(""),
  users: Joi.array().items(Joi.string().hex().length(24)),
  tenantId: Joi.string().hex().length(24).required(),
});

export const updatePhaseSchema = createPhaseSchema.fork(
  ["name", "order", "tenantId"],
  (schema) => schema.optional()
);

// ---- User Validation ----
export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "phase_head", "operator").required(),
  phases: Joi.array().items(Joi.string().hex().length(24)),
  tenantId: Joi.string().hex().length(24).required(),
});

export const updateUserSchema = createUserSchema.fork(
  ["name", "email", "password", "role", "tenantId"],
  (schema) => schema.optional()
);

// ---- Form Template Validation ----
export const createFormTemplateSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  fields: Joi.array()
    .items(
      Joi.object({
        label: Joi.string().trim().required(),
        fieldType: Joi.string()
          .valid("small_text", "large_text", "image", "dropdown")
          .required(),
        options: Joi.when("fieldType", {
          is: "dropdown",
          then: Joi.array().items(Joi.string()).min(1).required(),
          otherwise: Joi.forbidden(),
        }),
        required: Joi.boolean().default(false),
      })
    )
    .min(1)
    .required(),
  tenantId: Joi.string().hex().length(24).required(),
});
