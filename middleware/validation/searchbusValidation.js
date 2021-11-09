const Joi = require('joi').extend(require('@joi/date'));
const option = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

function createSortValidate(req, res, next) {
  const createSortValidate = {
    departure_shuttle_id: Joi.string().required(),
    arrival_shuttle_id: Joi.string().required(),
    departure_date: Joi.date().format('YYYY-MM-DD').required(),
    sort_by: Joi.string().valid(
      'price',
      'departure_time',
      'arrival_time',
      'duration',
      ''
    ),
    direction: Joi.string().valid('ASC', 'DESC', ''),
  };

  if (req.query.sort_by && !req.query.direction) {
    return res.status(400).json({
      status: 'failed',
      message: 'Bad Request',
      errors: 'direction cannot be empty when sort by is filled',
    });
  }

  const schema = Joi.object(createSortValidate);
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

module.exports = { createSortValidate };
