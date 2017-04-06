var Migrator = require('./markermigrator');
var PlantMigrator = require('./plantmigrator');
var assert = require("assert")
var PlantMatcher = require('./../instagramimport/plantmatcher');

var TestUserUtils = require('./../test/test.user.utils.js');
var TestMarkerUtils = require('./../test/test.marker.utils.js');
var marker = {
  "id": "4805",
  "plant_id": 123,
  "plant_name": null,
  "plant_species": null,
  "user_plant": "user plant",
  "source": "instagram",
  "source_id": "911218845908944671_311835720",
  "title": "",
  "description": "CLEAN EATS in Mount Maunganui now has our raw, stone-ground nut butters on their shelves and in their cafe! Have you eaten at #Cleaneats?",
  "images": [
    {
      "id": "10292",
      "low_resolution": {
        "url": "http://scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/s306x306/e15/10959171_339975319539833_1587403258_n.jpg",
        "width": 306,
        "height": 306
      },
      "thumbnail": {
        "url": "http://scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/10959171_339975319539833_1587403258_n.jpg",
        "width": 150,
        "height": 150
      },
      "standard_resolution": {
        "url": "http://scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/10959171_339975319539833_1587403258_n.jpg",
        "width": 640,
        "height": 640
      },
      "image_credit": "",
      "image_credit_link": ""
    }
  ],
  "location": {
    "latitude": -37.640451742,
    "longitude": 175.977901891,
    "name": "332 Maunganui road",
    "state": "Bay Of Plenty",
    "country": "New Zealand"
  },
  "user": {
    "id": "311835720",
    "source": "instagram",
    "wf_user_id": "615",
    "username": "haydenbooker",
    "full_name": "Vigour & Vitality",
    "profile_picture": "http://photos-f.ak.instagram.com/hphotos-ak-xpa1/925550_1477781372511413_174850416_a.jpg",
    "profile_link": "http://instagram.com/haydenbooker",
    "active_user": "0"
  },
  "tags": [
    "healthyfood",
    "freshfood",

  ],
  "comments": {
    "count": 1,
    "data": [
      {
        "created_time": 1422845846,
        "text": "#eatclean #freshfood #healthy #healthyliving #healthyfood #health #holistic #longevity #nutrition #nutritionist #newzealand #aotearoa #bayofplenty #tauranga #mountmaunganui #katikati #wildfood #vigourandvitality",
        "id": "8946",
        "from": {
          "id": "311835720",
          "source": "instagram",
          "wf_user_id": "5520",
          "username": "vigourandvitality",
          "full_name": "Vigour & Vitality",
          "profile_picture": "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10809749_796656310393447_1138179981_a.jpg",
          "profile_link": "http://instagram.com/vigourandvitality",
          "active_user": "0"
        },
        "images": [{
          "id": "10292",
          "low_resolution": {
            "url": "http://scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/s306x306/e15/10959171_339975319539833_1587403258_n.jpg",
            "width": 306,
            "height": 306
          },
          "thumbnail": {
            "url": "http://scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/10959171_339975319539833_1587403258_n.jpg",
            "width": 150,
            "height": 150
          },
          "standard_resolution": {
            "url": "http://scontent-b.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/10959171_339975319539833_1587403258_n.jpg",
            "width": 640,
            "height": 640
          },
          "image_credit": "",
          "image_credit_link": ""
        }]
      }
    ]
  },
  "created_time": "1422845772",
  "mine": false,
  "active": "1",
  "verified": "0",
  "favourited": false,
  "unknown": "0"
};

describe.skip('migrator', function () {
  beforeEach(function (done) {
    TestMarkerUtils.seedDb().then(function (m) {
      done();
    }).done();
  });

  it('migrate one marker', function (done) {
    this.timeout(4000);
    marker.source_id = new Date().getTime();
    marker.id = new Date().getTime();
    marker.legacyid = new Date().getTime();


    Migrator.importMarker(marker, []).then(function (returnmarker) {
      // console.log(JSON.stringify(returnmarker));
      assert.equal(returnmarker.description, marker.description);
      assert.equal(returnmarker.source, marker.source);
      //assert.equal(returnmarker.title, marker.title);
      assert.equal(returnmarker.source_id, marker.source_id);
      assert.equal(returnmarker.plant_by_user, marker.user_plant);
      assert.equal(returnmarker.active, true);
      assert.equal(returnmarker.plant_unknown, false);
      assert.equal(returnmarker.created, "Mon Feb 02 2015 13:56:12 GMT+1100 (AUS Eastern Daylight Time)");
      //assert.equal(returnmarker.verified, false);
      assert.equal(returnmarker.images[0].versions.low.url, marker.images[0].low_resolution.url);
      assert.equal(returnmarker.images[0].versions.standard.url, marker.images[0].standard_resolution.url);
      assert.equal(returnmarker.images[0].versions.thumb.url, marker.images[0].thumbnail.url);

      assert.equal(returnmarker.comments[0].created, "Mon Feb 02 2015 13:57:26 GMT+1100 (AUS Eastern Daylight Time)");
      assert.equal(returnmarker.comments[0].text, marker.comments.data[0].text);
      assert.equal(returnmarker.comments[0].owner.name, marker.comments.data[0].from.username);
      assert.equal(returnmarker.comments[0].owner.profile_picture, marker.comments.data[0].from.profile_picture);
      assert.equal(returnmarker.comments[0].owner.profile_link, marker.comments.data[0].from.profile_link);

      console.log(marker.comments.data[0]);
      assert.equal(returnmarker.comments[0].images[0].versions.low.url, marker.comments.data[0].images[0].low_resolution.url);
      assert.equal(returnmarker.comments[0].images[0].versions.standard.url, marker.comments.data[0].images[0].standard_resolution.url);
      assert.equal(returnmarker.comments[0].images[0].versions.thumb.url, marker.comments.data[0].images[0].thumbnail.url);

      assert.equal(returnmarker.location.position[0], marker.location.longitude);
      assert.equal(returnmarker.location.position[1], marker.location.latitude);
      console.log(returnmarker.location.address);

      assert.equal(returnmarker.location.address.state.long_name, 'Bay Of Plenty');
      assert.equal(returnmarker.location.address.state.short_name, 'Bay Of Plenty');
      assert.equal(returnmarker.location.address.country.short_name, 'NZ');
      assert.equal(returnmarker.location.address.country.long_name, 'New Zealand');
      assert.equal(returnmarker.location.address.locality.long_name, '332 Maunganui road');
      assert.equal(returnmarker.location.address.locality.short_name, '332 Maunganui road');
      assert.equal(returnmarker.location.address.formatted_long, '332 Maunganui road, Bay Of Plenty, New Zealand');
      assert.equal(returnmarker.location.address.formatted_short, '332 Maunganui road Bay Of Plenty NZ');


      assert.equal(returnmarker.plant.scientificName, "Rubus parvifolius");
      done();
    }).done();
  });
});
describe.skip('migrator', function () {
  beforeEach(function (done) {
    TestMarkerUtils.seedDb().then(function (m) {
      done();
    }).done();
  });
  it('migrate one marker with plant matching', function (done) {
    this.timeout(3000);
    marker.source_id = new Date().getTime();
    marker.legacyid = new Date().getTime();
    marker.id = new Date().getTime();
    marker.plant_id = null;
    marker.plant_name = null;
    marker.plant_species = null;

    marker.tags = [
      "wildfood",
      "bushfood",
      "NativeRaspberry"
    ];

    PlantMatcher.getPlantsToMath().then(function (plants) {
      console.log(plants)
      return Migrator.importMarker(marker, plants).then(function (returnmarker) {
        assert.equal(returnmarker.plant.scientificName, "Rubus parvifolius");
        done();
      }).done();
    })
      .done();
  });
});
describe.skip('migrator', function () {
  beforeEach(function (done) {
    TestMarkerUtils.seedDb().then(function (m) {
      done();
    }).done();
  });
  it('migrate markers array', function (done) {
    this.timeout(4000);
    marker.source_id = new Date().getTime();
    marker.legacyid = new Date().getTime();
    marker.id = new Date().getTime();
    Migrator.migrateMarkerList([marker]).then(function (results) {
      assert.equal(results.length, 1);
      done();
    }).done();
  });

});
//it.only('migrate markers', function (done) {
//  this.timeout(1000000);
//  // this.timeout(20000);
//  TestUserUtils.loginAdmin().then(function () {
//    return TestUserUtils.getCurrentUser().then(function (user) {
//      return PlantMigrator.migratePlants(user._id).then(function (result) {
//        return Migrator.migrateMarkers().then(function (result) {
//          done();
//        }).done();
//      });
//    });
//  });
//});




