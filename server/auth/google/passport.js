var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var PassportUtils = require('./../passport.utils');

exports.setup = function (User, config) {
  passport.use(new GoogleStrategy({
      clientID: config.getOauthConfig('google').clientID,
      clientSecret: config.getOauthConfig('google').clientSecret,
      callbackURL: config.getOauthConfig('google').callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        return PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'google', done);
    }
  ));
};
