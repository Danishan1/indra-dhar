// validations/item.validation.js
import Joi from "joi";

export const createItemSchema = Joi.object({
  templateId: Joi.string().hex().length(24).required(),
  formData: Joi.object().required(),
  images: Joi.array().items(Joi.string().uri()),
});

export const bulkAddSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        templateId: Joi.string().hex().length(24).required(),
        formData: Joi.object().required(),
        images: Joi.array().items(Joi.string().uri()),
      })
    )
    .min(1)
    .required(),
});

export const moveItemSchema = Joi.object({
  itemIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
});

export const returnItemSchema = Joi.object({
  itemIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  toPhaseId: Joi.string().hex().length(24).required(),
  note: Joi.string().allow(""),
});
