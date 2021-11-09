const router = require('express').Router();
const {
  createUser,
  login,
  getUserProfile,
  uploadPicture,
  updateUserProfile,
  forgotPassword,
  loginWithToken,
} = require('../controller/userController');
const { changePassword } = require('../controller/passwordController');
const { isLogin, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/uploadfile');
const {
  registerValidate,
  loginValidate,
  changePasswordValidate,
  updateProfileValidate,
} = require('../middleware/validation/userValidation');
const timeout = require('connect-timeout');

router.get('/', isLogin, getUserProfile);
router.post('/auth',loginWithToken)
router.post('/register', registerValidate, createUser);
router.post('/login', loginValidate, login);
router.post('/updatePicture', timeout('30s'), isLogin, upload, uploadPicture);
router.patch('/profile', isLogin, updateProfileValidate, updateUserProfile);
router.patch('/', isLogin, changePassword);
router.patch('/forgot', isLogin, forgotPassword);

module.exports = router;
