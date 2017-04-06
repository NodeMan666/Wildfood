'use strict';

var should = require('should');
var assert = require("assert")
var app = require('./../app');
var request = require('supertest');
var Q = require("q");
var TestUserUtils = require('./../test/test.user.utils.js');
var TestMarkerUtils = require('./../test/test.marker.utils.js');


describe('Iphone + android login tests', function () {
  var admin;

  before(function (done) {
    TestUserUtils.clearUsersAndCreateAdmin().then(function (a) {
      admin = a;
      done();
    });
  });


  it('google', function (done) {

    var id = new Date().getTime();
    var profile = {
      "kind": "plus#person",
      "etag": "RqKWnRU4WW46-6W3rWhLR9iFZQM/2l2A7pkq7TDk-bbuXLxEkC7cKIw",
      "occupation": "Employee of Golden Gekko",
      "skills": "C++, Java, Android, PHP, HTML, JAVASCRIPT",
      "gender": "male",
      "objectType": "person",
      "id": id,
      "displayName": "veasna sreng",
      "name": {
        "familyName": "sreng",
        "givenName": "veasna"
      },
      "url": "https://plus.google.com/+veasnasrengcambodia",
      "image": {
        "url": "https://lh5.googleusercontent.com/-nSV3LkYy9Vo/AAAAAAAAAAI/AAAAAAAABaA/-CZVKlZEArA/photo.jpg?sz=50",
        "isDefault": false
      },
      "organizations": [
        {
          "name": "Institute of Technology of Cambodia",
          "type": "school",
          "primary": false
        },
        {
          "name": "Back Touk High school",
          "type": "school",
          "primary": false
        },
        {
          "name": "Ros sey srok High school",
          "type": "school",
          "primary": false
        },
        {
          "name": "Svay sach phnom",
          "type": "school",
          "primary": false
        },
        {
          "name": "Golden Gekko",
          "title": "Android Developer",
          "type": "work",
          "startDate": "2012",
          "primary": true
        },
        {
          "name": "Wing",
          "title": "Wing Co, Ltd.",
          "type": "work",
          "startDate": "2011",
          "endDate": "2012",
          "primary": false
        },
        {
          "name": "Refresh Mobile Co, Ltd.",
          "title": "Employee of Refresh Mobile Co, Ltd.",
          "type": "work",
          "startDate": "2010",
          "endDate": "2011",
          "primary": false
        }
      ],
      "placesLived": [
        {
          "value": "Phnom Penh capital",
          "primary": true
        },
        {
          "value": "kampong cham provine"
        },
        {
          "value": "Kampong Cham"
        },
        {
          "value": "Preah vihear"
        }
      ],
      "isPlusUser": true,
      "circledByCount": 533,
      "verified": false,
      "cover": {
        "layout": "banner",
        "coverPhoto": {
          "url": "https://lh3.googleusercontent.com/-q1IPe7EiCaU/Uc85usLG4TI/AAAAAAAABeE/1VTAi1pll1c/s630-fcrop64=1,009609bafd0cdfb8/single-tree_4c232ae3909ce_hires.png",
          "height": 626,
          "width": 940
        },
        "coverInfo": {
          "topImageOffset": -1,
          "leftImageOffset": 0
        }
      }
    };

    TestUserUtils.loginMobile(profile, 'google').then(function (token) {
      assert(token != null);
      TestUserUtils.getCurrentUser(profile).then(function (user) {
        console.log("Current user ", user)
        //assert.equal(user.email, idfromface+"salla.mankinen@gmail.com");
        assert.equal(user.fullname, profile.displayName);
        assert.equal(user.role, "user");
        assert.equal(user.provider, "google");
        assert.equal(user.name, id);
        assert.equal(user.profile_picture, profile.image.url);
        assert.equal(user.profile_link, profile.url);
        assert.equal(user.oauth.google.id, id);
        done();
      }).done();
    }).done();


  });

  it('facebook', function (done) {

    var id = new Date().getTime();
    var profile = {
      "id": id,
      "name": "Salla Mankinen",
      "first_name": "Salla",
      "last_name": "Mankinen",
      "link": "https://www.facebook.com/app_scoped_user_id/10152396971096916/",
      "profile_picture": "https://graph.facebook.com/10152396971096916/picture"
    };


    TestUserUtils.loginMobile(profile, 'facebook').then(function (token) {
      assert(token != null);
      TestUserUtils.getCurrentUser(profile).then(function (user) {
        console.log("Created user ", user)
        //assert.equal(user.email, idfromface+"salla.mankinen@gmail.com");
        assert.equal(user.fullname, profile.name);
        assert.equal(user.role, "user");
        assert.equal(user.provider, "facebook");
        assert.equal(user.name, profile.name);
        assert.equal(user.profile_picture, profile.profile_picture);
        assert.equal(user.profile_link, profile.link);
        assert.equal(user.oauth.facebook.id, id);

        TestUserUtils.loginMobile(profile, 'facebook').then(function (token) {
          assert(token != null);
          TestUserUtils.getCurrentUser(profile).then(function (seconduser) {
            console.log("seconduser ", seconduser)
            assert.equal(user._id, seconduser._id);
            assert.equal(seconduser.oauth.facebook.loginCount, 2);
            done();
          }).done();
        }).done();
      }).done();
    }).done();


  });

  it.only('instagram', function (done) {

    var id = new Date().getTime();
    var profile = {
      "id": id,
      "name": "salla",
      "username": "salla_cambodia",
      "profile_picture": "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xap1/t51.2885-19/11078964_785835201503655_1094342064_a.jpg"
    }

    TestUserUtils.loginMobile(profile, 'instagram').then(function (token) {
      assert(token != null);
      TestUserUtils.getCurrentUser(profile).then(function (user) {
        console.log("Current user ", user)
        assert.equal(user.fullname, profile.full_name);
        assert.equal(user.role, "user");
        assert.equal(user.provider, "instagram");
        assert.equal(user.name, profile.username);
        assert.equal(user.profile_picture, profile.profile_picture);
        assert.equal(user.profile_link, 'http://instagram.com/' + profile.username);
        assert.equal(user.oauth.instagram.id, id);
        done();
      }).done();
    }).done();


  });

  it('twitter', function (done) {

    var id = new Date().getTime();
    var profile = {
      "profile_sidebar_fill_color": "F8FCF2",
      "profile_sidebar_border_color": "547980",
      "profile_background_tile": true,
      "name": "Ryan Sarver",
      "profile_image_url": "http://a0.twimg.com/profile_images/1777569006/image1327396628_normal.png",
      "created_at": "Mon Feb 26 18:05:55 +0000 2007",
      "location": "San Francisco, CA",
      "follow_request_sent": false,
      "profile_link_color": "547980",
      "is_translator": false,
      "id_str": "795649",
      "default_profile": false,
      "contributors_enabled": true,
      "favourites_count": 3162,
      "url": null,
      "profile_image_url_https": "https://si0.twimg.com/profile_images/1777569006/image1327396628_normal.png",
      "utc_offset": -28800,
      "id": id,
      "profile_use_background_image": true,
      "listed_count": 1586,
      "profile_text_color": "594F4F",
      "lang": "en",
      "followers_count": 276334,
      "protected": false,
      "notifications": true,
      "profile_background_image_url_https": "https://si0.twimg.com/profile_background_images/113854313/xa60e82408188860c483d73444d53e21.png",
      "profile_background_color": "45ADA8",
      "verified": false,
      "geo_enabled": true,
      "time_zone": "Pacific Time (US & Canada)",
      "description": "Director, Platform at Twitter. Detroit and Boston export. Foodie and over-the-hill hockey player. @devon's lesser half",
      "default_profile_image": false,
      "profile_background_image_url": "http://a0.twimg.com/profile_background_images/113854313/xa60e82408188860c483d73444d53e21.png",
      "status": {
        "coordinates": null,
        "favorited": false,
        "truncated": false,
        "created_at": "Sat Aug 25 19:33:11 +0000 2012",
        "retweeted_status": {
          "coordinates": null,
          "favorited": false,
          "truncated": false,
          "created_at": "Sat Aug 25 19:20:36 +0000 2012",
          "id_str": "239442171466493953",
          "entities": {
            "urls": [
              {
                "expanded_url": "http://nbcnews.to/NtkRTJ",
                "url": "http://t.co/f8ivBrVd",
                "indices": [
                  102,
                  122
                ],
                "display_url": "nbcnews.to/NtkRTJ"
              }
            ],
            "hashtags": [],
            "user_mentions": []
          },
          "in_reply_to_user_id_str": null,
          "contributors": null,
          "text": "Neil Armstrong has died at the age of 82 from complications from heart operations he had 3 weeks ago. http://t.co/f8ivBrVd",
          "retweet_count": 112,
          "in_reply_to_status_id_str": null,
          "id": 239442171466493953,
          "geo": null,
          "retweeted": false,
          "possibly_sensitive": false,
          "in_reply_to_user_id": null,
          "place": null,
          "in_reply_to_screen_name": null,
          "source": "web",
          "in_reply_to_status_id": null
        },
        "id_str": "239445335481647105",
        "entities": {
          "urls": [
            {
              "expanded_url": "http://nbcnews.to/NtkRTJ",
              "url": "http://t.co/f8ivBrVd",
              "indices": [
                115,
                135
              ],
              "display_url": "nbcnews.to/NtkRTJ"
            }
          ],
          "hashtags": [],
          "user_mentions": [
            {
              "name": "NBC News",
              "id_str": "14173315",
              "id": 14173315,
              "indices": [
                3,
                11
              ],
              "screen_name": "NBCNews"
            }
          ]
        },
        "in_reply_to_user_id_str": null,
        "contributors": null,
        "text": "RT @NBCNews: Neil Armstrong has died at the age of 82 from complications from heart operations he had 3 weeks ago. http://t.co/f8ivBrVd",
        "retweet_count": 112,
        "in_reply_to_status_id_str": null,
        "id": 239445335481647105,
        "geo": null,
        "retweeted": false,
        "possibly_sensitive": false,
        "in_reply_to_user_id": null,
        "place": null,
        "in_reply_to_screen_name": null,
        "source": "",
        "in_reply_to_status_id": null
      },
      "statuses_count": 13728,
      "friends_count": 1780,
      "following": true,
      "show_all_inline_media": true,
      "screen_name": "rsarver"
    }
    TestUserUtils.loginMobile(profile, 'twitter').then(function (token) {
      assert(token != null);
      TestUserUtils.getCurrentUser(profile).then(function (user) {
        console.log("Current user ", user)
        assert.equal(user.fullname, profile.name);
        assert.equal(user.role, "user");
        assert.equal(user.provider, "twitter");
        assert.equal(user.name, profile.screen_name);
        assert.equal(user.profile_picture, profile.profile_image_url);
        assert.equal(user.profile_link, 'http://twitter.com/' + profile.screen_name);
        assert.equal(user.oauth.twitter.id, id);
        done();
      }).done();
    }).done();


  });

})
;
