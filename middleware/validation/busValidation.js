const Joi = require('joi');
const option = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

function createProviderValidate(req, res, next) {
  const createProviderValidate = {
    provider_name: Joi.string().required(),
    city: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^[0-9]+$/)
      .required(),
    website: Joi.string(),
    facebook: Joi.string(),
    instagram: Joi.string(),
    twitter: Joi.string(),
    photo: Joi.string(),
    banking_name: Joi.string(),
    banking_account: Joi.string(),
    tax_id: Joi.string().required(),
    ktp_owner: Joi.string(),
    owner_picture: Joi.string(),
  };
  const schema = Joi.object(createProviderValidate);
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

function createScheduleValidate(req, res, next) {
  const createScheduleValidate = {
    departure_time: Joi.string()
      .regex(/^([0-9]{2})\:([0-9]{2})$/)
      .required(),
    arrival_time: Joi.string()
      .regex(/^([0-9]{2})\:([0-9]{2})$/)
      .required(),
    destination_city: Joi.string().required(),
    departure_city: Joi.string().required(),
    arrival_shuttle: Joi.string().required(),
    departure_shuttle: Joi.string().required(),
    price: Joi.number().required(),
    published: Joi.boolean().required(),
  };
  const schema = Joi.object(createScheduleValidate);
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
function createShuttleValidate(req, res, next) {
  const createShuttleValidate = {
    city: Joi.string().required(),
    shuttle_name: Joi.string().required(),
    address: Joi.string().required(),
    published: Joi.boolean().required(),
  };
  const schema = Joi.object(createShuttleValidate);
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
module.exports = {
  createProviderValidate,
  createScheduleValidate,
  createShuttleValidate,
};
