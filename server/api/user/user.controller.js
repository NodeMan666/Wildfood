'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Q = require("q");
var _ = require('lodash');
var Paging = require('./../../components/paging/paging.utils');

var userouput = '-salt -hashedPassword -oauth -favoritePlants -favoriteMarkers -role -provider -loginCount'
var meoutput = '-salt -hashedPassword';

var validationError = function (res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
  var conditions = {};
  if (req.query.search != null) {
    conditions = getSearchConditions(req.query.search);
  }
  return getUsersByConditionAndReturn(req, conditions, res);
}
exports.search = function (req, res) {
  var conditions = getSearchConditions(req.query.search);
  return getUsersByConditionAndReturn(req, conditions, res);
}
exports.searchall = function (req, res) {
  var conditions = getNameSearchConditions(req.query.search);
  return getUsersByConditionAndReturn(req, conditions, res);
}


function getSearchConditions(searchstring) {


  var userwithactivity = {
    $or: [
      {imported: false},
      {
        $or: [
          {'likedMarkers.count': {$gt: 3}},
          {'myMarkers.count': {$gt: 3}}
        ]
      },
      {'oauth.totalLoginCount': {$gt: 0}}
    ]
  }

  var cond = getNameSearchConditions(searchstring)

  cond.$and = [
    userwithactivity
  ]

  return cond;
}
function getNameSearchConditions(searchstring) {
  //i makes it case insensitive
  var regex = new RegExp(searchstring, "i");
  var cond = {
    $or: [
      {fullname: regex},
      {name: regex}
    ]
  }
  return cond;
}

exports.searchUsers = function (searchStr, req, res) {
  var conditions = getSearchConditions(searchStr);
  return getUsers(req, conditions, res);
}

;

function getUsers(req, conditions, res) {
  var deferred = Q.defer();
  User.find(conditions, userouput)
    .sort('created')
    .skip(Paging.getSkip(req))
    .limit(Paging.getLimit(req))
    .exec(function (err, plants) {
      if (err) {
        return handleError(res, err);
      }
      deferred.resolve(Paging.populatePagedResults(plants, req));
    });
  return deferred.promise;
}

function getUsersByConditionAndReturn(req, conditions, res) {
  User.find(conditions, userouput)
    .sort('created')
    .skip(Paging.getSkip(req))
    .limit(Paging.getLimit(req))
    .exec(function (err, users) {
      if (err) return res.send(500, err);
      res.json(200, Paging.populatePagedResults(users, req));
    });
}

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function (err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
    res.json({token: token});
  });
};



exports.getServerSideUser = function (userid, res) {
  var deferred = Q.defer();
  User.findById(userid, function (err, user) {
    if (err) return handleError(res, err);
    if (!user) return res.send(401);
    deferred.resolve(user);
  });
  return deferred.promise;
}

exports.getFavoriteIds = function (req, res, property) {
  var deferred = Q.defer();
  exports.getServerSideUser(req.user.id, res).then(function (user) {
    console.log(JSON.stringify(user));
    var ids = _.map(user[property].items, function (fav) {
      return fav.refid;
    });
    deferred.resolve(ids);
  });
  return deferred.promise;
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  exports.getServerSideUser(userId, res).then(function (user) {
    res.json(user.profile);
  });
};


exports.showPublicProfile = function (req, res, next) {
  var userId = req.params.id;

  exports.getServerSideUser(userId, res).then(function (user) {
    res.json(user.profile);
  });
};


exports.getfavoritemarkers = function (req, res) {

  exports.getFavoriteIds(req, res, "favoriteMarkers").then(function (ids) {
    return res.json(200, ids);
  });
};

exports.getfavoriteplants = function (req, res) {
  exports.getFavoriteIds(req, res, "favoritePlants").then(function (ids) {
    return res.json(200, ids);
  });
};


exports.toggleFavoriteMarker = function (req, res) {
  return updateFavoriteStatusAndReturn(req, "favoriteMarkers", res);
};

exports.addFavoriteMarker = function (req, res) {

  req.body.targetid = req.params.markerid;
  req.body.state = true;

  return updateFavoriteStatusAndReturn(req, "favoriteMarkers", res);
};

exports.deleteFavoriteMarker = function (req, res) {

  req.body.targetid = req.params.markerid;
  req.body.state = false;

  return updateFavoriteStatusAndReturn(req, "favoriteMarkers", res);
};


exports.toggleFavoritePlant = function (req, res) {
  return updateFavoriteStatusAndReturn(req, "favoritePlants", res);

};


function updateFavoriteStatusAndReturn(req, propertykey, res) {
  exports.updateFavoriteStatus(propertykey, req.body, req.user.id).then(function (marker) {
    res.json(200, "OK");
  }, function (err) {
    handleError(res, err);
  });
}

exports.deleteFavoritePlant = function (req, res) {

  req.body.targetid = req.params.plantid;
  req.body.state = false;

  return updateFavoriteStatusAndReturn(req, "favoritePlants", res);
};

exports.addFavoritePlant = function (req, res) {

  req.body.targetid = req.params.plantid;
  req.body.state = true;

  return updateFavoriteStatusAndReturn(req, "favoritePlants", res);
};

exports.updateListItem = function (key, params, userId) {
  var deferred = Q.defer();
  var elId = params.targetid;
  var type = params.state;

  User.findOne({
    _id: userId
  }, function (err, user) {

    if (!user) {
      console.log("user not found " + userId);
      deferred.reject(new Error("user not found with " + userId));
    }

    if (user[key].items == null) {
      user[key].items = [];
    }

    var existingItem = findVoteItem(user, key, elId);


    var count = user[key].items.length;

    var sets = {$set: {}};
    if (type) {
      sets.$push = {};
      sets.$push[key + ".items"] = {refid: elId};
      count++;
    } else {
      sets.$pull = {};

      sets.$pull[key + ".items"] = existingItem;
      count--;
    }
    sets.$set[key + ".count"] = count;
    User.update({_id: userId},
      sets, {upsert: true}, function (err, data) {
        deferred.resolve(null);
      });

  });


  return deferred.promise;
}

function findVoteItem(marker, key, userid) {
  var found = null;
  if (marker[key] && marker[key].items) {
    marker[key].items.forEach(function (like) {
      if (like.refid == userid) {
        found = like;
      }
    });
  }
  return found;
}
exports.updateFavoriteStatus = function (propertykey, params, userId) {
  return exports.updateListItem(propertykey, params, userId);
}


function handleError(res, err) {
  return res.send(500, err);
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  var newPassRepeat = String(req.body.newPasswordRepeat);

  User.findById(userId, function (err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};
exports.updatedetails = function (req, res, next) {
  var userId = req.user._id;
  var id = req.params.id;

  if (userId != id) {
    return res.send(403);
  }

  //profile_picture
  User.findById(userId, function (err, user) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.profile_picture = req.body.profile_picture;
    user.save(function (err) {
      if (err) return validationError(res, err);
      res.send(200, user);
    });
  });
};
/**
 * Get my info
 */
exports.me = function (req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, meoutput, function (err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
  console.log("authCallback");

  res.redirect('/');
};
