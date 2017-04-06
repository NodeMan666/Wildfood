'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user.model');
var assert = require("assert")


var usero = {
  provider: 'local',
    name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
}

var user = new User(usero);

describe('User Model', function () {
  beforeEach(function (done) {
    // Clear users before testing
    User.remove().exec().then(function () {
      done();
    });
  });

  //afterEach(function (done) {
  //  User.remove().exec().then(function () {
  //    done();
  //  });
  //});

  it('should begin with no users', function (done) {
    User.find({}, function (err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a user with same instagram id', function (done) {
    user.oauth = {
      instagram: {id: "123"}
    };

    user.save(function (dd) {

      User.findById(user._id, function (err, created) {
        console.log(created);
        assert.equal(created.oauth.instagram.id, "123");
        var userDup = new User({
          provider: 'local',
          name: 'Fake Userss',
          email: 'testssss@test.com',
          password: 'password',
          oauth : {
            instagram: {id: "123"}
          }
        });

        userDup.save(function (err) {
          console.log(err);
          should.exist(err);
          done();
        });
      });
    });
  });

  it('should fail when saving a duplicate user', function (done) {
    var user = new User(usero);
    user.save(function (err, u) {
      should.not.exist(err);
      var userDup = new User(usero);
      userDup.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function (done) {
    user.email = '';
    user.save(function (err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate user if password is valid", function () {
    return user.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function () {
    return user.authenticate('blah').should.not.be.true;
  });
})
;
