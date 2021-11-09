const { User, Password, sequelize } = require('../models');
const { encrypt, checkPassword } = require('../helper/encryption');

async function createPassword(user) {
  const pass = await Password.create({
    password: encrypt(user.password),
    user_id: user.id,
  });
  return pass;
}

async function changePassword(req, res) {
  const result = await User.findAll({
    where: {
      id: req.user.id,
    },
    include: [Password],
  });
  if (
    checkPassword(req.body.old_password, result[0].dataValues.Password.password)
  ) {
    await result[0].Password.update({
      password: encrypt(req.body.new_password),
    });
    return res
      .status(200)
      .json({ status: 'success', message: 'password has been changed !' });
  } else {
    return res
      .status(400)
      .json({
        status: 'failed',
        message: 'old-password is not match !',
        error: e,
      });
  }
}

module.exports = { createPassword, changePassword };
