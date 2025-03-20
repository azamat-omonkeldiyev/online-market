const Joi = require("joi");

const productValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name cannot be longer than 100 characters",
    }),
  description: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description cannot be longer than 500 characters",
    }),
  price: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.integer": "Price must be an integer",
      "number.min": "Price must be a positive number",
      "any.required": "Price is required",
    }),
  image: Joi.string()
    .uri()
    .required()
    .messages({
      "string.uri": "Image must be a valid URL",
      "string.empty": "Image is required",
    }),
  star: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": "Star rating must be a number",
      "number.integer": "Star rating must be an integer",
      "number.min": "Star rating must be at least 1",
      "number.max": "Star rating cannot exceed 5",
      "any.required": "Star rating is required",
    }),
  category_id: Joi.number()
    .integer()
    .required()
    .messages({
      "number.base": "Category ID must be a number",
      "number.integer": "Category ID must be an integer",
      "any.required": "Category ID is required",
    })
}).strict();

module.exports = productValidationSchema;