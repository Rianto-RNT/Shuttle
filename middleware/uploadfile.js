const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './config/config.env' });
const timeout = require('connect-timeout');

cloudinary.config({
  cloud_name: 'dn7cuvi05',
  api_key: '673965512636534',
  api_secret: 'jizC28w_nb_Ca7aH3uDGvF_o7mw',
});


const upload = (req, res, next) => {
  try {
    const file ='data:image/jpeg;base64,'+req.body.image;
    cloudinary.uploader
      .upload(file)
      .then((result) => {
        req.pp = result;
        next();
      })
      .catch((e) => {
        return res
          .status(400)
          .json({ status: 'failed', error: e, message: 'error has occured' });
      });
  } catch (e) {
    return res
      .status(400)
      .json({
        status: 'failed',
        error: e,
        message: 'req.files.avatar is not found / Error has been occured',
      });
  }
};

module.exports = { upload };
