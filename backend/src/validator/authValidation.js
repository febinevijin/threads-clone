import Joi from 'joi';

export const userSignUpValidation = Joi.object({
  name: Joi.string()
    .min(3) // Ensure at least one character is present
    // .custom((value, helpers) => {
    //   if (value.trim().split(/\s+/).length <= 3) {
    //     return helpers.message('Name must be a string with more than 3 words.');
    //   }
    //   return value;
    // })
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'string.email': 'Email must be valid and end with .com or .net.',
    }),

  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be more than 8 characters long.',
  }),

  userName: Joi.string()
    .min(3) // Ensure at least one character is present
    .required(),
});
export const userLoginValidation = Joi.object({
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be more than 8 characters long.',
  }),

  userName: Joi.string()
    .min(3) // Ensure at least one character is present
    .required(),
});
export const userProfileValidation = Joi.object({
  name: Joi.string()
    .min(3) // Ensure at least one character is present
    // .custom((value, helpers) => {
    //   if (value.trim().split(/\s+/).length <= 3) {
    //     return helpers.message('Name must be a string with more than 3 words.');
    //   }
    //   return value;
    // })
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'string.email': 'Email must be valid and end with .com or .net.',
    }),

  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be more than 8 characters long.',
  }),

  userName: Joi.string()
    .min(3) // Ensure at least one character is present
    .required(),
});
