var UserUtils = require('./user.utils');

exports.createOrUpdateUserBasedOnOathProfile = function (User, profile, type, done) {

  UserUtils.createOrUpdateUserBasedOnOathProfile(User, profile, type, convert, false).then(function (user) {
    return done(null, user);
  }, function (err) {
    return done(err);
  }).done();
}


function convert(profile, type, cleanedType) {
  var oauthProfile = coversionMethods[type](profile);
  oauthProfile.provider = cleanedType;
  oauthProfile.original_provider_profile = profile._json;
  oauthProfile.id = profile.id;
  oauthProfile.updated = new Date();
  return oauthProfile;
}

var coversionMethods = {
  facebook: function (profile) {
    var result = {
      username: profile._json.name,
      fullname: profile._json.name,
      email: profile._json.email,
      profile_link: profile._json.link
    };

    if (profile.photos && profile.photos.length > 0) {
      result.profile_picture = profile.photos[0].value;
    }
    return result;
  },
  facebook_mobile: function (profile) {
    var result = {
      username: profile.name,
      fullname: profile.name,
      profile_picture: profile.profile_picture,
      email: '',
      profile_link: profile.link
    };

    //if (profile.photos && profile.photos.length > 0) {
    //  result.profile_picture = profile.photos[0].value;
    //}
    return result;
  },
  instagram: function (input) {
    var userdetails = input._json.data;
    return {
      username: userdetails.username,
      fullname: userdetails.full_name,
      profile_picture: userdetails.profile_picture,
      profile_link: "http://instagram.com/" + userdetails.username
    }
  },

  instagram_mobile: function (input) {
    var userdetails = input;
    return {
      username: userdetails.username,
      fullname: userdetails.full_name,
      profile_picture: userdetails.profile_picture,
      profile_link: "http://instagram.com/" + userdetails.username
    }
  },

  google_mobile: function (input) {
    var email = '';
    if (input.emails && input.emails.length > 0) {
      email = input.emails[0].value;
    }
    var username = input.id;
    if (email != null && email != '') {
      username = email;
    }

    var picture = null;
    if (input.image && input.image.url) {
      picture  = input.image.url;
    }

    return {
      username: username,
      email: email,
      fullname: input.displayName,
      profile_picture: picture ,
      profile_link: input.url
    }
  },

  google: function (input) {

    var userdetails = input._json;

    var email = '';

    if (input.emails && input.emails.length > 0) {
      email = input.emails[0].value;
    }

    var username = input.id;

    if (email != null && email != '') {
      username = email;
    }

    var picture = null;
    if (input.photos && input.photos.length > 0) {
      picture  = input.photos[0].value;
    }

    return {
      username: username,
      email: email,
      fullname: userdetails.displayName,
      profile_picture: picture ,
      profile_link: userdetails.url
    }
  },

  twitter: function (input) {

    var userdetails = input._json;
    return {
      username: userdetails.screen_name,
      fullname: userdetails.name,
      profile_picture: userdetails.profile_image_url,
      profile_link: "http://twitter.com/" + userdetails.screen_name
    }

  },
  twitter_mobile: function (input) {

    var userdetails = input;
    return {
      username: userdetails.screen_name,
      fullname: userdetails.name,
      profile_picture: userdetails.profile_image_url,
      profile_link: "http://twitter.com/" + userdetails.screen_name
    }

  }

}
