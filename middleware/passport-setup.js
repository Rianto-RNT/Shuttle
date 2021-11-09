const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '345429176534-c9pe0ocbtsq92trinm9kgc6c6rq52t37.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL:
        'https://final-project-shuttle.herokuapp.com/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

module.exports = passport;
