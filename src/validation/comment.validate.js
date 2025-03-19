const Joi = require("joi");

const commentValidationSchema = Joi.object({
  message: Joi.string()
    .min(3)
    .max(500)
    .required()
    .messages({
      "string.empty": "Message is required",
      "string.min": "Message must be at least 3 characters long",
      "string.max": "Message cannot be longer than 500 characters",
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
  product_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.uuid": "Product ID must be a valid UUID",
      "string.empty": "Product ID is required",
    }),
  author_id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.uuid": "Author ID must be a valid UUID",
      "string.empty": "Author ID is required",
    }),
}).strict();

const commentUpdateSchema = Joi.object({
  message: Joi.string()
    .min(3)
    .max(500)
    .messages({
      "string.min": "Message must be at least 3 characters long",
      "string.max": "Message cannot be longer than 500 characters",
    }),
  star: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      "number.base": "Star rating must be a number",
      "number.integer": "Star rating must be an integer",
      "number.min": "Star rating must be at least 1",
      "number.max": "Star rating cannot exceed 5",
    }),
  product_id: Joi.string()
    .uuid()
    .messages({
      "string.uuid": "Product ID must be a valid UUID",
    }),
  author_id: Joi.string()
    .uuid()
    .messages({
      "string.uuid": "Author ID must be a valid UUID",
    }),
}).strict().min(1);


module.exports = { commentValidationSchema, commentUpdateSchema };