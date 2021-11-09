const Joi = require('joi');
const option = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

function registerValidate(req, res, next) {
  const userSchema = {
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    birthday: Joi.string().required(),
    password: Joi.string().min(5).required(),
    roles: Joi.string().required(),
  };
  const schema = Joi.object(userSchema);
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
function loginValidate(req, res, next) {
  const loginSchema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  };
  const schema = Joi.object(loginSchema);
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
function changePasswordValidate(req, res, next) {
  const changePasswordSchema = {
    old_password: Joi.string().min(5).required(),
    new_password: Joi.string().min(5).required(),
  };
  const schema = Joi.object(changePasswordSchema);
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

function updateProfileValidate(req, res, next) {
  const updateProfileValidate = {
    fullname: Joi.string(),
    email: Joi.any().forbidden(),
    birthday: Joi.string(),
    profile_picture: Joi.string(),
    roles: Joi.any().forbidden(),
  };
  const schema = Joi.object(updateProfileValidate);
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
  registerValidate,
  loginValidate,
  updateProfileValidate,
  changePasswordValidate,
};
