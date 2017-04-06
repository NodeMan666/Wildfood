'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['twitter', 'facebook', 'google', 'instagram'];


var OAuthProfile = {
  id: {type: String, index: true},
  profile_picture: String,
  profile_link: String,
  fullname: String,
  username: String,
  provider: String,
  loginCount: {
    type: Number,
    default: 0
  },
  email: {type: String, lowercase: true},
  updated: {type: Date},
  original_provider_profile: {}
};

var MarkerItem = {
  refid: {type: Schema.Types.ObjectId, ref: 'Marker'},
  updated: {type: Date, default: Date.now}
};

var MarkerItemSet = {
  count: {type: Number, default: 0, index: true},
  items: [MarkerItem]
};

var PlantItemSet = {
  count: {type: Number, default: 0, index: true},
  items: [{
    refid: {type: Schema.Types.ObjectId, ref: 'Plant'},
    updated: {type: Date, default: Date.now}
  }]
};

var UserSchema = new Schema({
  name: String,
  fullname: String,
  profile_picture: String,
  profile_link: String,
  totalLoginCount: Number, //should get rid of this!!!!! or use as a total
  provider: String, //should get rid of this
  imported: Boolean,
  email: {type: String, lowercase: true},
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  salt: String,
  oauth: {
    local: OAuthProfile,
    facebook: OAuthProfile,
    twitter: OAuthProfile,
    instagram: OAuthProfile,
    google: OAuthProfile
  },
  loginCount: {
    type: Number,
    default: 0
  },
  favoritePlants: PlantItemSet,
  favoriteMarkers: MarkerItemSet,
  likedMarkers: MarkerItemSet,
  confirmedMarkers: MarkerItemSet,
  notfoundMarkers: MarkerItemSet,
  myMarkers: MarkerItemSet,
  myCommentedMarkers: MarkerItemSet
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'name': this.name,
      'profile_picture': this.profile_picture,
      'profile_link': this.profile_link,
      'fullname': this.fullname
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

UserSchema.virtual('authtoken').get(function() {
  return this._authtoken;
});

UserSchema.virtual('authtoken').set(function(authtoken) {
  return this._authtoken = authtoken;
});

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function (err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified email address is already in use.');

// Validate provider id is not duplicated
UserSchema
  .path('oauth.instagram.id')
  .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({'oauth.instagram.id': value}, function (err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified instagram id is already in use');

var validatePresenceOf = function (value) {
  return value && value.length;
};

//TODO: should not be able to create a admin user, unless you are an admin user yourself

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
