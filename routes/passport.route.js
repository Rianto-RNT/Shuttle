const passport = require('passport');
const {
  loginWithGoogleOAuth,
  loginWithFacebook,
  loginWithToken,
} = require('../controller/userController');
const router = require('express').Router();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

router.get('/failed', (req, res) => res.send('failed to login'));
router.get('/success', (req, res) => res.send('Login success'));

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'],
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/failed' }),
  loginWithGoogleOAuth
);

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  loginWithFacebook
);

router.get('/token', loginWithToken);

module.exports = router;
