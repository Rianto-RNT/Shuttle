const { verify } = require('jsonwebtoken');
const { User } = require('../models');
const dotenv = require('dotenv').config({ path: './config/config.env' });

async function isLogin(req, res, next) {
  let token;
  try {
    token = req.headers.authorization.split(' ')[1];

    if (!token)
      return res
        .status(401)
        .json({
          status: 'failedd',
          message: 'Not authorized , please Login ',
          error: e,
        });
    const { email } = verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (req.user) next();
    else throw new Error();
  } catch (e) {
    return res
      .status(401)
      .json({
        status: 'failed',
        message: 'Not authorized , please Login ',
        error: e,
      });
  }
}

function authorize(role) {
  return (req, res, next) => {
    if (req.user.dataValues.roles == role) next();
    else
      return res
        .status(400)
        .json({
          status: 'failed',
          message: `this route is only authorize for ${role}`,
        });
  };
}

module.exports = { isLogin, authorize };
