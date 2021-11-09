const Joi = require('joi');
const option = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

function createOrderValidate(req, res, next) {
  const createOrderValidate = {
    departure_date: Joi.date(),
    fullname: Joi.array().required(),
    email: Joi.array().items(Joi.string().required()).required(),
    age: Joi.array().items(Joi.number().max(100).min(5).required()).required(),
    phone: Joi.array()
      .items(
        Joi.string()
          .pattern(/^[0-9]+$/)
          .required()
      )
      .required(),
    departure_seat: Joi.array().items(Joi.number().min(1).max(40)).required(),
    passenger: Joi.number().min(1).max(10).required(),
    order_type: Joi.string().required(),
    departure_bus_id: Joi.string().uuid().required(),
  };
  const schema = Joi.object(createOrderValidate);
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

function seatArrangementValidate(req, res, next) {
  const seatArrangementValidate = {
    date: Joi.date().required(),
    bus_schedule_id: Joi.string().uuid().required(),
  };
  const schema = Joi.object(seatArrangementValidate);
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

module.exports = { createOrderValidate, seatArrangementValidate };
