const Joi = require("joi");

const categoryValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name cannot be longer than 50 characters",
    }),
}).strict();

const categoryUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name cannot be longer than 50 characters",
    }),
}).strict().min(1);



module.exports = { categoryValidationSchema, categoryUpdateSchema };