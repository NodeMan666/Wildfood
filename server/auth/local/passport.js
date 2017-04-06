var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function (email, password, done) {
      User.findOne({
        email: email.toLowerCase()
      }, function (err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, {message: 'This email is not registered.'});
        }
        if (!user.authenticate(password)) {
          return done(null, false, {message: 'This password is not correct.'});
        }

        if (user.oauth['local'] == null) {
          user.oauth['local'] = {
            provider: 'local'
          };
        }
        user.loginCount = (user.loginCount || 0) + 1;
        user.oauth['local'].loginCount = (user.oauth['local'].loginCount || 0 ) + 1;

        user.save(function (err) {
          if (err) done(err);
          return done(err, user);
        });

      });
    }
  ));
};
