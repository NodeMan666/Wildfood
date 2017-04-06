var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var PassportUtils = require('./../passport.utils');

exports.setup = function (User, config) {

  console.log("setup facebook passport");
    passport.use(new FacebookStrategy({
            clientID: config.getOauthConfig('facebook').clientID,
            clientSecret: config.getOauthConfig('facebook').clientSecret,
            callbackURL: config.getOauthConfig('facebook').callbackURL,
            profileFields: ['id', 'displayName', 'photos', 'link' ,'name', 'email']
        },
        function (accessToken, refreshToken, profile, done) {
          console.log("return from auth/facebook");
            return PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'facebook', done);
        }
    ))
    ;
}
;
