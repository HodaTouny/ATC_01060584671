const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('user').optional() 
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  

module.exports = {
  registerSchema,
  loginSchema
};