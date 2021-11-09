const { User, Password, sequelize } = require('../models');
const { Sequelize, Transaction, DATEONLY, DATE } = require('sequelize');
const { checkPassword } = require('../helper/encryption');
const { sign } = require('jsonwebtoken');
const { createPassword } = require('./passwordController');
const { verify } = require('../helper/verify');
const { encrypt } = require('../helper/encryption');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');



async function createUser(req, res) {
  try {
    let token;
    const result = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      },
      async (t) => {
        const [user, created] = await User.findOrCreate({
          where: {
            email: req.body.email,
          },
          defaults: {
            ...req.body,
          },
        });
        if (!created)
          return res
            .status(400)
            .json({ status: 'failed', message: 'this email has register !' });
        createPassword(
          {
            password: req.body.password,
            id: user.id,
          },
          { transaction: t }
        );
        token = sign(user.dataValues, process.env.JWT_SECRET);
        return res.status(200).json({
          status: 'success',
          message: 'User has been created !',
          token: token,
        });
      }
    );
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Something missing', error: e });
  }
}

async function updateUserProfile(req, res) {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (req.body.email)
      return res
        .status(400)
        .json({ status: 'failed', message: 'email cannot be changed !' });
    const updatedUser = await User.update(
      { ...req.body },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    return res
      .status(200)
      .json({ status: 'success', message: 'User profile has been changed' });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Error has occured ', error: e });
  }
}

async function getUserProfile(req, res) {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    return res.status(200).json({ status: 'success', data: user });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'error has occured !', error: e });
  }
}

async function uploadPicture(req, res) {
  await User.update(
    {
      profile_picture: req.pp.url,
    },
    {
      where: {
        id: req.user.dataValues.id,
      },
    }
  );
  return res.status(200).json({ status: 'success', data: req.pp.url });
}

async function login(req, res) {
  let token;
  const options = {
    expire: new Date().setDate(Date.now() + 30),
    httpOnly: true,
  };
  try {
    const user = await User.findOne({
      include: [Password],
      where: {
        email: req.body.email,
      },
    });
    const result = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      birthday: user.birthday,
      roles: user.roles,
      profile_picture: user.profile_picture,
    };
    if (checkPassword(req.body.password, user.Password.password)) {
      token = sign(result, process.env.JWT_SECRET);

      return res
        .status(200)
        .cookie('token', token, options)
        .json({ status: 'success', token: token });
    } else throw new Error();
  } catch (e) {
    return res.status(400).json({
      status: 'failed',
      message: 'username/password is wrong',
      error: e,
    });
  }
}

async function loginWithGoogleOAuth(req, res) {
  try {
    let tokens;
    let data;
    const result = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      },
      async (t) => {
        const checkEmail = await User.findOne(
          {
            where: {
              email: req.user._json.email,
            },
          },
          { transaction: t }
        );

        if (checkEmail) {
          data = {
            id: checkEmail.id,
            email: checkEmail.email,
            fullname: checkEmail.fullname,
          };
        } else {
          data = await User.create(
            {
              username: req.user.displayName,
              email: req.user._json.email,
              birthday: new Date(),
              profile_picture: req.user._json.picture,
              roles: 'user',
            },
            { transaction: t }
          );

          createPassword(
            {
              password: req.user.id,
              id: data.id,
            },
            { transaction: t }
          );
        }
        const options = {
          expire: new Date().setDate(Date.now() + 30),
          httpOnly: true,
        };
        tokens = sign(data, process.env.JWT_SECRET);

        return res.status(200).json({ status: 'success', token: tokens });
      }
    );
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Something missing', error: e });
  }
}
async function loginWithFacebook(req, res) {
  try {
    let tokens;
    let data;
    const { email, first_name } = req.user._json;
    const result = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      },
      async (t) => {
        const checkEmail = await User.findOne(
          {
            where: {
              email: email,
            },
          },
          { transaction: t }
        );
        if (checkEmail) {
          data = {
            id: checkEmail.id,
            email: checkEmail.email,
            fullname: checkEmail.fullname,
          };
        } else {
          const user = await User.create(
            {
              fullname: first_name,
              email: email,
              birthday: new Date(),
              roles: 'user',
            },
            { transaction: t }
          );
          createPassword(
            {
              password: user.id,
              id: user.id,
            },
            { transaction: t }
          );
          data = {
            id: user.dataValues.id,
            fullname: user.dataValues.fullname,
            email: user.dataValues.email,
          };
        }
        tokens = sign(data, process.env.JWT_SECRET);
        return res.status(200).json({ status: 'success', token: tokens });
      }
    );
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Something missing', error: e });
  }
}

async function loginWithToken(req, res) {
  const { token } = req.query;

  const { email, name } = await verify(token).catch((err) => {
    return res
      .status(400)
      .json({ name: 'GOOGLE_ERROR', message: 'Token is wrong !' });
  });
  let tokens;
  try {
    if (email) {
      const checkEmail = await User.findOne({
        where: {
          email: email,
        },
      });
      if (checkEmail) {
        data = {
          id: checkEmail.id,
          email: checkEmail.email,
          fullname: checkEmail.fullname,
        };
      } else {
        const user = await User.create({
          fullname: name,
          email: email,
          birthday: new Date(),
          roles: 'user',
        });
        createPassword({
          password: user.id,
          id: user.id,
        });
        data = {
          id: user.dataValues.id,
          fullname: user.dataValues.fullname,
          email: user.dataValues.email,
        };
      }
      tokens = sign(data, process.env.JWT_SECRET);
      return res.status(200).json({ status: 'success', token: tokens });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: ' Error has occured ', error: e });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'shuttlefinalproject@gmail.com',
          pass: '@Secret123',
        },
      });
      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve('./views'),
          defaultLayout: false,
        },
        viewPath: path.resolve('./views'),
      };
      transporter.use('compile', hbs(handlebarOptions));
      const mailOption = {
        from: 'shuttlefinalproject@gmail.com',
        to: user.email,
        subject: 'Shuttle Reset Password !',
        template: 'reset',
        context: {
          url: `https://final-project-shuttle.herokuapp.com/`,
          name: user.fullname,
        },
      };
      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
        }
        console.log('Message sent : ');
      });

      return res.status(200).json({ status: 'success' });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'error has occured !', error: e });
  }
}

module.exports = {
  login,
  createUser,
  getUserProfile,
  uploadPicture,
  loginWithGoogleOAuth,
  updateUserProfile,
  loginWithFacebook,
  loginWithToken,
  forgotPassword,
};
