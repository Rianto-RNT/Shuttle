const passports = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passports.use(
  new FacebookStrategy(
    {
      clientID: '1570789569922691',
      clientSecret: 'c4cb34945086910d55715e79dff00a29',
      callbackURL:
        'https://final-project-shuttle.herokuapp.com/auth/facebook/callback',
      profileFields: ['id', 'email', 'name'],
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

module.exports = passports;
