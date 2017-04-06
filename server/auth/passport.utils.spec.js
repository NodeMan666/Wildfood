var PassportUtils = require('./passport.utils');
var User = require('./../api/user/user.model');
var assert = require("assert")

describe('Test creating and updating users', function () {

  beforeEach(function (done) {
    // Clear users before testing
    User.remove().exec().then(function () {
      done();
    });
  });

  it('create new user from oauth profile', function (done) {
    var idfromface = new Date().getTime() + "";

    var profile = {
      id: idfromface,
      "username": "",
      "displayName": "Salla Mankinen",
      "name": {
        "familyName": "Mankinen",
        "givenName": "Salla",
        "middleName": ""
      },
      "gender": "",
      "profileUrl": "https://www.facebook.com/app_scoped_user_id/10152415323946916/",
      "emails": [
        {
          "value": idfromface+ "sallamankinen@hotmail.com"
        }
      ],
      "provider": "facebook",
      "_json": {
        "id": idfromface,
        "email": idfromface+"sallamankinen@hotmail.com",
        "first_name": "Salla",
        "last_name": "Mankinen",
        "link": "https://www.facebook.com/app_scoped_user_id/10152415323946916/",
        "locale": "en_US",
        "name": "Salla Mankinen",
        "timezone": 11,
        "updated_time": "2014-07-07T21:06:46+0000",
        "verified": true
      }
    };

    PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'facebook', function (err, user) {

      var firstuser = user;
      assert(user._id != null);
      assert.equal(user.name, "Salla Mankinen");
      assert.equal(user.fullname, "Salla Mankinen");
      assert.equal(user.role, "user");
      assert.equal(user.provider, "facebook");
      assert.equal(user.loginCount, 1);
      //assert.equal(user.profile_picture, "https://www.facebook.com/app_scoped_user_id/10152415323946916/");
      assert.equal(user.profile_link, "https://www.facebook.com/app_scoped_user_id/10152415323946916/");
      assert.equal(user.oauth.facebook.id, idfromface);
      assert.equal(user.oauth.facebook.original_provider_profile.name, "Salla Mankinen");
      assert.equal(user.oauth.facebook.original_provider_profile.link, "https://www.facebook.com/app_scoped_user_id/10152415323946916/");
      assert.equal(user.oauth.facebook.original_provider_profile.id, idfromface);
      assert.equal(user.oauth.facebook.loginCount, 1);

      profile._json.name = "salla2";
      profile._json.thumbnail = "thumb2";
      profile._json.link = "link2";

      //should update the details as they are by the same provider and haven't update the details from the app in between

      PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'facebook', function (err, seconduser) {
        console.log(err);
        assert(seconduser._id != null);
        assert.equal(seconduser.loginCount, 2);
        assert.notStrictEqual(seconduser._id, firstuser._id);
        assert.equal(seconduser.name, "salla2");
        //assert.equal(seconduser.profile_picture, "thumb2");
        assert.equal(seconduser.profile_link, "link2");
        assert.equal(seconduser.oauth.facebook.id, idfromface);
        assert.equal(seconduser.oauth.facebook.original_provider_profile.name, "salla2");
        //assert.equal(seconduser.oauth.facebook.original_provider_profile.thumbnail, "thumb2");
        assert.equal(seconduser.oauth.facebook.original_provider_profile.link, "link2");
        assert.equal(seconduser.oauth.facebook.loginCount, 2);
        assert.equal(seconduser.oauth.facebook.original_provider_profile.id, idfromface);
        done();
      });


    });
  });


  it('Oauth Facebook', function (done) {
    var idfromface = new Date().getTime() + "";
    var profile = {
      id: idfromface,
      "username": "",
      "displayName": "Salla Mankinen",
      "name": {
        "familyName": "Mankinen",
        "givenName": "Salla",
        "middleName": ""
      },
      "gender": "",
      "profileUrl": "https://www.facebook.com/app_scoped_user_id/10152415323946916/",
      "emails": [
        {
          "value": idfromface+"sallamankinen@hotmail.com"
        }
      ],
      photos: [ { value: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/v/t1.0-1/c17.12.149.149/s50x50/222627_5541336915_2265_n.jpg?oh=00db4c7a437301686c5eb372638de3ae&oe=55671DC2&__gda__=1432836914_17e7a00d9eee8c155f2f0113890a46d4' } ],

      "provider": "facebook",
      "_json": {
        "id": idfromface,
        "email": idfromface+"sallamankinen@hotmail.com",
        "first_name": "Salla",
        "last_name": "Mankinen",
        "link": "https://www.facebook.com/app_scoped_user_id/10152415323946916/",
        "locale": "en_US",
        "name": "Salla Mankinen",
        "timezone": 11,
        "updated_time": "2014-07-07T21:06:46+0000",
        "verified": true
      }
    };

    PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'facebook', function (err, user) {

      var firstuser = user;

      assert(user._id != null);
      assert.equal(user.name, "Salla Mankinen");
      assert.equal(user.fullname, "Salla Mankinen");
      assert.equal(user.email, idfromface+"sallamankinen@hotmail.com");

      assert.equal(user.role, "user");
      assert.equal(user.loginCount, 1);
      assert.equal(user.provider, "facebook");
      assert.equal(user.profile_picture, "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/v/t1.0-1/c17.12.149.149/s50x50/222627_5541336915_2265_n.jpg?oh=00db4c7a437301686c5eb372638de3ae&oe=55671DC2&__gda__=1432836914_17e7a00d9eee8c155f2f0113890a46d4");
      assert.equal(user.profile_link, "https://www.facebook.com/app_scoped_user_id/10152415323946916/");
      assert.equal(user.oauth.facebook.id, idfromface);
      assert.equal(user.oauth.facebook.loginCount, 1);
      assert.equal(user.oauth.facebook.original_provider_profile.id, idfromface);


      done();

    });
  });
  it('Oauth google', function (done) {
    var idfromface = new Date().getTime() + "";


      var profile = {
        "provider": "google",
        "id": idfromface,
        "displayName": "Salla Mankinen",
        "name": {
          "familyName": "Mankinen",
          "givenName": "Salla"
        },
        "emails": [
          {
            "value": idfromface +"salla.mankinen@gmail.com",
            "type": "account"
          }
        ],
        "photos": [
          {
            "value": "https://lh6.googleusercontent.com/-aTVjtY5ldNk/AAAAAAAAAAI/AAAAAAAAAlo/KkCI-cglfNU/photo.jpg?sz=50"
          }
        ],
        "gender": "female",
        "_raw": "{\n \"kind\": \"plus#person\",\n \"etag\": \"\\\"RqKWnRU4WW46-6W3rWhLR9iFZQM/sxXHNVR7lqLo1RYpKks8MHxVwjo\\\"\",\n \"gender\": \"female\",\n \"emails\": [\n  {\n   \"value\": \"salla.mankinen@gmail.com\",\n   \"type\": \"account\"\n  }\n ],\n \"objectType\": \"person\",\n \"id\": \"112316880724319900014\",\n \"displayName\": \"Salla Mankinen\",\n \"name\": {\n  \"familyName\": \"Mankinen\",\n  \"givenName\": \"Salla\"\n },\n \"url\": \"https://plus.google.com/112316880724319900014\",\n \"image\": {\n  \"url\": \"https://lh6.googleusercontent.com/-aTVjtY5ldNk/AAAAAAAAAAI/AAAAAAAAAlo/KkCI-cglfNU/photo.jpg?sz=50\",\n  \"isDefault\": false\n },\n \"isPlusUser\": true,\n \"language\": \"en_GB\",\n \"verified\": false\n}\n",
        "_json": {
          "kind": "plus#person",
          "etag": "\"RqKWnRU4WW46-6W3rWhLR9iFZQM/sxXHNVR7lqLo1RYpKks8MHxVwjo\"",
          "gender": "female",
          "emails": [
            {
              "value":  idfromface +"salla.mankinen@gmail.com",
              "type": "account"
            }
          ],
          "objectType": "person",
          "id": idfromface,
          "displayName": "Salla Mankinen",
          "name": {
            "familyName": "Mankinen",
            "givenName": "Salla"
          },
          "url": "https://plus.google.com/112316880724319900014",
          "image": {
            "url": "https://lh6.googleusercontent.com/-aTVjtY5ldNk/AAAAAAAAAAI/AAAAAAAAAlo/KkCI-cglfNU/photo.jpg?sz=50",
            "isDefault": false
          },
          "isPlusUser": true,
          "language": "en_GB",
          "verified": false
        }
      };

    PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'google', function (err, user) {

      var firstuser = user;

      assert(user._id != null);
      assert.equal(user.name, idfromface+"salla.mankinen@gmail.com");
      assert.equal(user.email, idfromface+"salla.mankinen@gmail.com");
      assert.equal(user.fullname, "Salla Mankinen");
      assert.equal(user.role, "user");
      assert.equal(user.provider, "google");
      assert.equal(user.profile_picture, "https://lh6.googleusercontent.com/-aTVjtY5ldNk/AAAAAAAAAAI/AAAAAAAAAlo/KkCI-cglfNU/photo.jpg?sz=50");
      assert.equal(user.profile_link, "https://plus.google.com/112316880724319900014");
      assert.equal(user.oauth.google.id, idfromface);
      assert.equal(user.oauth.google.original_provider_profile.id, idfromface);


      done();

    });

  });
  it('Oauth twitter', function (done) {
    var idfromface = new Date().getTime() + "";
    var profile = {
      "id": idfromface,
      "username": "smankine",
      "displayName": "Salla Mankinen",
      "_json": {
        "id": idfromface,
        "id_str": "53297435",
        "name": "Salla Mankinen",
        "screen_name": "smankine",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_image_url": "http://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png",
        "profile_image_url_https": "https://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png",
        "created_at": "Fri Jul 03 04:47:03 +0000 2009",
        "favourites_count": 0,
        "utc_offset": null,
        "time_zone": null
      }
    }

    PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'twitter', function (err, user) {

      var firstuser = user;

      assert(user._id != null);
      assert.equal(user.name, "smankine");
      assert(user.email==null);
      assert.equal(user.fullname, "Salla Mankinen");
      assert.equal(user.role, "user");
      assert.equal(user.provider, "twitter");
      assert.equal(user.profile_picture, "http://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png");
      assert.equal(user.profile_link, "http://twitter.com/smankine");
      assert.equal(user.oauth.twitter.id, idfromface);
      assert.equal(user.oauth.twitter.original_provider_profile.id, idfromface);


      done();

    });

  });

  it('Oauth instagram', function (done) {
    var idfromface = new Date().getTime() + "";
    var profile = {
      "provider": "instagram",
      "id": idfromface,
      "displayName": "salla",
      "username": "smankinen",
      "_json": {
        "meta": {
          "code": 200
        },
        "data": {
          "username": "smankinen",
          "bio": "",
          "website": "",
          "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10401729_295396457305173_1486345968_a.jpg",
          "full_name": "salla",
          "id": idfromface
        }
      }
    }

    PassportUtils.createOrUpdateUserBasedOnOathProfile(User, profile, 'instagram', function (err, user) {

      var firstuser = user;

      assert(user._id != null);
      assert.equal(user.name, "smankinen");
      assert(user.email==null);
      assert.equal(user.fullname, "salla");
      assert.equal(user.role, "user");
      assert.equal(user.provider, "instagram");
      assert.equal(user.profile_picture, "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/10401729_295396457305173_1486345968_a.jpg");
      assert.equal(user.profile_link, "http://instagram.com/smankinen");
      assert.equal(user.oauth.instagram.id, idfromface);
      assert.equal(user.oauth.instagram.original_provider_profile.data.id, idfromface);


      done();

    });

  });
});
