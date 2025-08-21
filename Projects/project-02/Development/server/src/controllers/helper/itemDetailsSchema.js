import Joi from "joi";

export const itemDetailsSchema = Joi.object({
  name: Joi.string().trim().required().label("Product Name"),
  description: Joi.string().trim().required(),
  code: Joi.string().trim().required(),
  buyerName: Joi.string().trim().required(),
  vendorName: Joi.string().trim().required(),
  color: Joi.string().trim().required(),
  items: Joi.number().integer().min(1).required().label("No. of Items"),
}).unknown(true);
