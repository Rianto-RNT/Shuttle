const Joi = require('joi');
const option = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

function createPaymentValidate(req, res, next) {
  const createPaymentValidate = {
    order_id: Joi.string().uuid().required(),
  };
  const schema = Joi.object(createPaymentValidate);
  const { error } = schema.validate(req.query, option);
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

module.exports = { createPaymentValidate };
