import Joi from 'joi';

export const userPostValidation = Joi.object({
  text: Joi.string()
    .max(250)
    .message('Text must not contain more than 250 characters'),
  // .custom((value, helpers) => {
  //   const wordCount = value.split(/\s+/).length; // Count words by splitting on whitespace
  //   if (wordCount > 100) {
  //     return helpers.message('Text must not contain more than 100 words');
  //   }
  //   return value;
  // }),
  img: Joi.string(),
});
export const userReplyValidation = Joi.object({
  text: Joi.string()
    .max(250)
    .message('reply must not contain more than 250 characters')
    // .custom((value, helpers) => {
    //   const wordCount = value.split(/\s+/).length; // Count words by splitting on whitespace
    //   if (wordCount > 100) {
    //     return helpers.message('Text must not contain more than 100 words');
    //   }
    //   return value;
    // }),
    .required(),
});
