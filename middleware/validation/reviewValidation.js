const Joi = require('joi');
const option = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

function createReviewValidate(req, res, next) {
  const reviewSchema = {
    order_id: Joi.string().uuid().required(),
    order_detail_id: Joi.string().uuid().required(),
    review: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  };
  const schema = Joi.object(reviewSchema);
  const { error } = schema.validate(req.body, option);
  if (error) {
    return res.status(400).json({
      status: 'failed',
      message: 'Bad Request',
      errors: error['details'][0]['message'],
    });
  } else {
    next();
  }
}

module.exports = { createReviewValidate };
