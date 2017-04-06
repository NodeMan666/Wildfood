var Userrefresher = require('./userrefresher');
var assert = require("assert")
var Q = require("q");
var TestUserUtils = require('./../../test/test.user.utils.js');


describe('instagram user refresh', function () {
  before(function (done) {
    TestUserUtils.clearUsers().then(function (m) {
      done();
    });

  });

  it('refresh user', function (done) {
    this.timeout(4000);
    var user = {
      "username": "kookeetleef",
      "website": "",
      "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10890688_1403527006608142_196412907_a.jpg",
      "full_name": "kookeetleef",
      "bio": "",
      id: "195651094"
    };

    Userrefresher.updateUser(user).then(function (createduser) {
      //   console.log(createduser);
      assert.equal(createduser.name, user.username);
      assert.equal(createduser.profile_link, 'http://instagram.com/kookeetleef');
      assert.equal(createduser.profile_picture, user.profile_picture);
      assert.equal(createduser.fullname, user.full_name);
      assert.equal(createduser.imported, true);

      Userrefresher.refreshExistingUsers().then(function (results) {
        var returnuser = results[0];
        assert.equal(returnuser.oauth.instagram.id, user.id);
        console.log(returnuser);
        done();
      }, function (err) {
        console.log(err);
      });


    }, function (err) {
      console.log(err);
    });


  });

  it('get from instagram', function (done) {

    var id = "195651094";
    Userrefresher.getLatestFromInstagram(id).then(function (returnuser) {
      assert.equal(returnuser.id, id);
      assert(returnuser.username != null)
      done()

    }, function (err) {
      console.log(err);
    });


  });


})
;
