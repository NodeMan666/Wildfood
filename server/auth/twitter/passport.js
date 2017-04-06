exports.setup = function (User, config) {
  var passport = require('passport');
  var TwitterStrategy = require('passport-twitter').Strategy;
  var PassportUtils = require('./../passport.utils');

  passport.use(new TwitterStrategy({
    consumerKey: config.getOauthConfig('twitter').clientID,
    consumerSecret: config.getOauthConfig('twitter').clientSecret,
    callbackURL: config.getOauthConfig('twitter').callbackURL
  },
  function(token, tokenSecret, profile, done) {
    console.log("return from auth/twitter");
      return PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'twitter', done);
    }
  ));
};
