var Q = require("q");
var User = require('../../api/user/user.model');
var UserUtils = require('../../auth/user.utils');
var Instagram = require('instagram-node-lib');
var Config = require('./../../config/environment');
var PromiseUtils = require('./../promiseUtils');
var moment = require('moment');
var JobController = require('./../../jobs/job.controller');

exports.updateUser = function (profile) {
  var deferred = Q.defer();
  UserUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'instagram', convert, true).then(function (user) {
    deferred.resolve(user);
  }, function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

function convert(profile) {
  var user = profile;
  user.name = profile.username;
  user.fullname = profile.full_name;
  user.profile_link = "http://instagram.com/" + profile.username
  user.profile_picture = profile.profile_picture
  return user;
}

exports.refreshOurUser = function (ouruser) {
  var deferred = Q.defer();

  var timeoutProtect = setTimeout(function () {
    timeoutProtect = null;

    exports.getLatestFromInstagram(ouruser.oauth.instagram.id).then(function (profile) {
      if (profile == 'APINotAllowedError') {
        deferred.resolve({status: 1, text: "Error with +" + ouruser.oauth.instagram.id + ": " + profile});
      } else {
        exports.updateUser(profile).then(function (user) {
          deferred.resolve(user);
        }, function (err) {
          deferred.reject(err);
        });
      }
    });
  }, Config.jobs.userrefresh.timeout);

  return deferred.promise;
}

exports.getLatestFromInstagram = function (id) {
  var deferred = Q.defer();
  console.log("getLatestFromInstagram " + id);
  Instagram.set('client_id', Config.instagram.client_id);
  Instagram.set('client_secret', Config.instagram.client_secret);

  Instagram.users.info({
    user_id: id,
    error: function (errorMessage, errorObject, caller) {

      console.log(errorMessage);
      deferred.resolve(errorMessage);
    }, complete: function (data) {
      // console.log(data);
      deferred.resolve(data);
    }
  });
  return deferred.promise;
}


exports.refreshExistingUsers = function (automaticRun) {
  console.log("----------------------------------------------------------------")
  console.log("START USER REFRESH " + new Date())
  console.log("job params:");
  console.log("timeout between users:" + Config.jobs.userrefresh.timeout);

  console.log("----------------------------------------------------------------")
  var deferred = Q.defer();
  var start = moment();
  getAllImportedInstagramUsers().then(function (users) {
    console.log(users.length + " instagram users to refresh from instgram");
    PromiseUtils.runAsyncFnBasedOnArray(users, exports.refreshOurUser).then(function (results) {
      JobController.printResults({timeout: Config.jobs.userrefresh.timeout}, start, results, 'User Refresh',automaticRun);
      deferred.resolve(results);
    });

  }).done();


  return deferred.promise;
}


function getAllImportedInstagramUsers() {
  var deferred = Q.defer();
  console.log("SELECT USERS FROM DB")

  //var conditions = {$and: [], $or: []};
  var conditions = {$and: []};
  conditions.$and.push({'oauth.instagram.id': {$exists: true}});
  conditions.$and.push({imported: true});
  //users that haven't logged in ever
  //conditions.$or.push({'oauth.instagram.loginCount': {$exists: false}});
  //conditions.$or.push({'oauth.instagram.loginCount': 0});

  //also where the update date is more than something!!!!!!!!!!!!!!!!!!!!!!!!!!
  //console.log(JSON.stringify(conditions));
  User.find(conditions, function (err, users) {
    if (err) {
      deferred.reject(err);
    }
    console.log(users.length + " users selected");
    console.log("----------------------------------------------------------------")
    deferred.resolve(users);
  });
  return deferred.promise;
}
