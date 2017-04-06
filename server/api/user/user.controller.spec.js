'use strict';

var should = require('should');
var assert = require("assert")

var app = require('../../app');
var request = require('supertest');
var Q = require("q");
var TestUserUtils = require('./../../test/test.user.utils.js');
var TestMarkerUtils = require('./../../test/test.marker.utils.js');
var User = require('./user.model');
var Mocks = require('./../../test/mocks');


describe('User controller tests', function () {
  var admin;

  before(function (done) {
    TestUserUtils.clearUsersAndCreateAdmin().then(function (a) {
      admin = a;
      done();
    });
  });


  describe('GET /api/users', function () {
    var token;
    before(function (done) {
      TestUserUtils.loginAdmin().then(function (t) {
        token = t;
        done();
      });
    });


  });

  describe('GET /api/users', function () {
    it('should respond with 403 when  not logged in', function (done) {
      request(app)
        .get('/api/users')
        .expect(403)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          done();
        });
    });
  });

  describe('POST /api/user', function () {
    it('create new user', function (done) {
      TestUserUtils.createUser().then(function (newuser) {
        console.log("here", newuser);
        assert(newuser.token != null);
        done();
      });
    });
  });
  describe('update user', function () {
    var user;
    before(function (done) {
      TestUserUtils.createUserAndLogin().then(function (m) {
        TestUserUtils.getCurrentUser().then(function (newuser) {
          user = newuser;
          done();
        });
      });

    });

    it('update user name and email', function (done) {
      var id = new Date().getTime();
      user.name = user.name + id;
      user.email = user.email + id;

      request(app)
        .put('/api/users/' + user._id + '/updatedetails')
        .set('Authorization', 'Bearer ' + TestUserUtils.getToken())
        .send(user)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          console.log(res.body);
          var updated = res.body;
          assert.equal(updated.name, user.name);
          assert.equal(updated.email, user.email);
          done();
        });
    });

    it('update profile picture', function (done) {

      this.timeout(20000);
      TestMarkerUtils.postimage().then(function (postedimage) {


        user.profile_picture = postedimage.versions.thumb.url;

        request(app)
          .put('/api/users/' + user._id + '/updatedetails')
          .set('Authorization', 'Bearer ' + TestUserUtils.getToken())
          .send(user)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            var updated = res.body;
            assert.equal(updated.profile_picture, user.profile_picture);
            done();
          });
      });


    });
  });

  describe('POST /me/togglefavoritemarker', function () {
    var marker;
    before(function (done) {
      TestMarkerUtils.seedDbLoginAndGetRandomMarker().then(function (m) {
        marker = m;
        done();
      });
    });

    it('toggle marker favorite status', function (done) {
      //   this.timeout(1000000);
      TestMarkerUtils.toggleFavoriteStatus(marker, true).then(function (result) {
        assert.equal(result, "OK");
        TestMarkerUtils.getFavoriteMarkers().then(function (t) {
          console.log(t);
          assert.equal(t[0], marker._id);
          TestMarkerUtils.toggleFavoriteStatus(marker, false).then(function (result) {
            assert.equal(result, "OK");
            TestMarkerUtils.getFavoriteMarkers().then(function (t) {
              assert.equal(t.length, 0);
              done();
            });
          });
        }).done();
      }).done();
    });
  });

  describe('POST /me/togglefavoriteplant', function () {
    var plants;
    before(function (done) {
      TestMarkerUtils.seedPlantsAndLogin().then(function (m) {
        plants = m;
        done();
      });
    });


    it('toggle plant favorite status', function (done) {
      var plant = plants[0];
      TestMarkerUtils.toggleFavoriteStatusForPlant(plant, true).then(function (result) {
        assert.equal(result, "OK");

        TestMarkerUtils.getFavoritePlants().then(function (t) {
          assert.equal(t[0], plant._id);
          TestMarkerUtils.toggleFavoriteStatusForPlant(plant, false).then(function (result) {
            assert.equal(result, "OK");
            TestMarkerUtils.getFavoritePlants().then(function (t) {
              assert.equal(t.length, 0);
              done();
            });
          }).done();
          ;
        }).done();
        ;
      }).done();
    });
  });

})
;
