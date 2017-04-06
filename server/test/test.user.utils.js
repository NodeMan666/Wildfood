'use strict';

var should = require('should');
var assert = require("assert")

var app = require('../app');
var request = require('supertest');
var Q = require("q");
var User = require('./../api/user/user.model.js');
var Mocks = require('./mocks');
var currentToken;

exports.loginMobile = function (profile, provider) {
  var deferred = Q.defer();
  request(app)
    .post('/auth/oauth')
    .send({
      profile: profile, token: '12343', provider:provider
    }
  )
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("logged in as user " + res.body.token);
      currentToken = res.body.token;
      deferred.resolve(res.body.token);
    });
  return deferred.promise;
}


exports.loginUser = function () {
  var deferred = Q.defer();
  request(app)
    .post('/auth/local')
    .send({email: Mocks.user.email, password: Mocks.user.password})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("logged in as user " + res.body.token);
      currentToken = res.body.token;
      deferred.resolve(res.body.token);

    });
  return deferred.promise;
}

exports.getCurrentUser = function () {
  var deferred = Q.defer();
  request(app)
    .get('/api/users/me')
    .set('Authorization', 'Bearer ' + currentToken)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      deferred.resolve(res.body)
    });
  return deferred.promise;
}

exports.logout = function () {
  //?????
  var deferred = Q.defer();
  request(app)
    .post('/auth/local')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      currentToken = null;
      deferred.resolve(res.body.token)

    });
  return deferred.promise;
}

exports.loginAdmin = function () {
  var deferred = Q.defer();
  request(app)
    .post('/auth/local')
    .send({email: Mocks.admin.email, password: Mocks.admin.password})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("logged in as admin " + res.body.token);
      currentToken = res.body.token;
      deferred.resolve(res.body.token)

    });
  return deferred.promise;
}


exports.createAdmin = function () {
  var deferred = Q.defer();
  var user = new User(Mocks.admin);
  user.save(function (createdUset) {
    console.log("created admin ");
    deferred.resolve(createdUset);
  });
  return deferred.promise;
}


exports.createUser = function () {
  var deferred = Q.defer();

  var user = Mocks.user;

  user.email = new Date().getTime() + user.email;
  request(app)
    .post('/api/users')
    .send(user)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("created user ", res.body);
      deferred.resolve(res.body);
    });
  return deferred.promise;
}


exports.createUserAndLogin = function () {
  var deferred = Q.defer();
  exports.createUser().then(function (user) {
    exports.loginUser().then(function (token) {
      currentToken = token;
      deferred.resolve(token);
    });
  });
  return deferred.promise;
}

exports.clearUsers = function () {
  var deferred = Q.defer();
  User.remove().exec(function () {
    console.log("clearUsers done");
    deferred.resolve();
  });
  return deferred.promise;
}


exports.clearUsersAndCreateAdmin = function () {
  var deferred = Q.defer();
  exports.clearUsers().then(function () {
    exports.createAdmin().then(function (a) {
      deferred.resolve(a);
    });
  });
  return deferred.promise;
}

exports.getToken = function () {
  return currentToken;
}


