var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var PassportUtils = require('./../passport.utils');

exports.setup = function (User, config) {
  passport.use(new InstagramStrategy({
      clientID: config.getOauthConfig('instagram').clientID,
      clientSecret: config.getOauthConfig('instagram').clientSecret,
      callbackURL: config.getOauthConfig('instagram').callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        return PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'instagram', done);
    }
  ));
};
