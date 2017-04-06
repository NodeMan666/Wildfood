var MarkerImporter = require('./markerImporter');
var PlantMatcher = require('./plantmatcher');
var assert = require("assert")

var TestUserUtils = require('./../test/test.user.utils.js');
var TestMarkerUtils = require('./../test/test.marker.utils.js');

var sample = {
  "tags": [
    "wildfood",
    "dandelions",
    "harvesting"
  ],
  "location": {
    "name": "Kep Beach",
    "latitude": 37.889709051,
    "longitude": -122.279031465
  },
  "comments": {
    "count": 4,
    "data": [

      {
        "created_time": "1422440576",
        "text": "Nice pic!",
        "from": {
          "username": "everydayfotoprjct",
          "profile_picture": "https://igcdn-photos-d-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10296576_1401790933448235_1009000338_a.jpg",
          "id": "1633982990",
          "full_name": "Everyday Foto Project"
        },
        "id": "907819808011132545"
      }
    ]
  },
  "created_time": "1422434852",
  "link": "http://instagram.com/p/yZDaL-kRwm/",
  "images": {
    "low_resolution": {
      "url": "http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/s306x306/e15/10954216_1567807883456717_1012211427_n.jpg",
      "width": 306,
      "height": 306
    },
    "thumbnail": {
      "url": "http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/10954216_1567807883456717_1012211427_n.jpg",
      "width": 150,
      "height": 150
    },
    "standard_resolution": {
      "url": "http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/10954216_1567807883456717_1012211427_n.jpg",
      "width": 640,
      "height": 640
    }
  },
  "users_in_photo": [],
  "caption": {
    "created_time": "1422434852",
    "text": "#dandelions #wildflowers #wildfood #livewild #liveauthentic #livefolk #kinfolk #foodstyling #spring #harvesting #eatableflowers #homemade #explore #liveauthentic #zen #intothefield #intothewild #vscophile #vscocam #flowerpower #wildcooking #nature #edibleplants",
    "from": {
      "username": "kookeetleef",
      "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10890688_1403527006608142_196412907_a.jpg",
      "id": "195651094",
      "full_name": "kookeetleef"
    },
    "id": "907771793783201398"
  },
  "type": "image",
  "id": "907771793598651430_195651094",
  "user": {
    "username": "kookeetleef",
    "website": "",
    "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/10890688_1403527006608142_196412907_a.jpg",
    "full_name": "kookeetleef fullname",
    "bio": "",
    "id": "195651094"
  }
};

var sample2 = {
  "id": "5092",
  "plant_id": "287",
  "plant_name": "Pepper tree",
  "plant_species": "Schinus molle",
  "user_plant": "",
  "source": "instagram",
  "source_id": "931401949881181729_458399488",
  "title": "",
  "description": "Freshly #foraged pink peppercorns from a Peruvian Pepper tree (Schinus molle). Unrelated to black pepper, #pink #peppercorns command a high price in #spice stores, but just so happen to grow all over the place in #California! Use then to infuse liquors, brew beer or in cooking. They smell incredible, spicy and resinous.",
  "images": [
    {
      "id": "10579",
      "low_resolution": {
        "url": "http://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s306x306/e15/10955137_1059503964063561_1015227015_n.jpg",
        "width": 306,
        "height": 306
      },
      "thumbnail": {
        "url": "http://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/10955137_1059503964063561_1015227015_n.jpg",
        "width": 150,
        "height": 150
      },
      "standard_resolution": {
        "url": "http://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/10955137_1059503964063561_1015227015_n.jpg",
        "width": 640,
        "height": 640
      },
      "image_credit": "",
      "image_credit_link": ""
    }
  ],
  "location": {
    "latitude": 34.087483333,
    "longitude": -118.249266667,
    "name": "Echo Park, Los Angeles",
    "state": "California",
    "country": "United States"
  },
  "user": {
    "id": "458399488",
    "source": "instagram",
    "wf_user_id": "1226",
    "username": "hawks_and_calligraphy",
    "full_name": "Jenny Kendler",
    "profile_picture": "http://photos-e.ak.instagram.com/hphotos-ak-xpa1/10387954_260177020837420_235166546_a.jpg",
    "profile_link": "http://instagram.com/hawks_and_calligraphy",
    "active_user": "0"
  },
  "tags": [
    "plants",
    "wildedibles",
    "peppercorns",
    "wildforaging",
    "california",
    "trees",
    "urbanforaging",
    "spice",
    "pink",
    "foraging",
    "wildfoodlove",
    "foraged",
    "la",
    "gourmet",
    "gourmetforfree",
    "echopark",
    "mydayinla"
  ],
  "comments": {
    "count": 1,
    "data": [
      {
        "created_time": 1425267620,
        "text": "#wildforaging #urbanforaging #wildfoodlove #foraged #foraging #wildedibles #LA #mydayinLA #EchoPark #plants #trees #gourmet #gourmetforfree",
        "id": "9148",
        "from": {
          "id": "458399488",
          "source": "instagram",
          "wf_user_id": "1226",
          "username": "hawks_and_calligraphy",
          "full_name": "Jenny Kendler",
          "profile_picture": "http://photos-e.ak.instagram.com/hphotos-ak-xpa1/10387954_260177020837420_235166546_a.jpg",
          "profile_link": "http://instagram.com/hawks_and_calligraphy",
          "active_user": "0"
        },
        "images": []
      }
    ]
  },
  "created_time": "1425251786",
  "mine": false,
  "active": "1",
  "verified": "1",
  "favourited": false,
  "unknown": "0"
}

describe('Instgram import one marker', function () {
  before(function (done) {
    TestMarkerUtils.seedPlantLoginAndGetRandomPlant().then(function (m) {
      done();
    });
  });


  it('test importing one marker', function (done) {
    this.timeout(5000);
    sample.id = new Date().getTime();
    MarkerImporter.importMarker(sample, []).then(function (createdmarker) {
      console.log(JSON.stringify(createdmarker));
      assert.equal(createdmarker.source_link, sample.link);
      assert.equal(createdmarker.source_id, sample.id);
      assert.equal(createdmarker.description, sample.caption.text);
      console.log(createdmarker.location.address)

      assert.equal(createdmarker.location.address.state.long_name, 'California');
      assert.equal(createdmarker.location.address.state.short_name, 'CA');
      assert.equal(createdmarker.location.address.country.short_name, 'US');
      assert.equal(createdmarker.location.address.country.long_name, 'United States');
      assert.equal(createdmarker.location.address.locality.long_name, 'Kep Beach');
      assert.equal(createdmarker.location.address.locality.short_name, 'Kep Beach');
      assert.equal(createdmarker.location.address.formatted_long, 'Kep Beach, California, United States');
      assert.equal(createdmarker.location.address.formatted_short, 'Kep Beach CA US');

      assert.equal(createdmarker.location.position[0], sample.location.longitude);
      assert.equal(createdmarker.location.position[1], sample.location.latitude);
      assert.equal(createdmarker.images.length, 1);
      assert.equal(createdmarker.images[0].versions.thumb.url, sample.images.thumbnail.url);
      assert.equal(createdmarker.created + '', 'Wed Jan 28 2015 19:47:32 GMT+1100 (AUS Eastern Daylight Time)');
      assert.equal(createdmarker.comments.length, 1);
      assert.equal(createdmarker.comments[0].text, sample.comments.data[0].text);
      assert.equal(createdmarker.comments[0].text, sample.comments.data[0].text);
      //
      assert.equal(createdmarker.comments[0].created, 'Wed Jan 28 2015 21:22:56 GMT+1100 (AUS Eastern Daylight Time)');

      assert.equal(createdmarker.comments[0].owner.name, sample.comments.data[0].from.username);
      assert.equal(createdmarker.comments[0].owner.profile_link, 'http://instagram.com/everydayfotoprjct');
      assert.equal(createdmarker.comments[0].owner.profile_picture, sample.comments.data[0].from.profile_picture);
      assert.equal(createdmarker.comments[0].owner.fullname, sample.comments.data[0].from.full_name);
      assert.equal(createdmarker.comments[0].owner.fullname, sample.comments.data[0].from.full_name);
      //
      //console.log(createdmarker.comments[0].owner);

      console.log(createdmarker.owner.instagram);
      assert.equal(createdmarker.owner.name, sample.user.username);
      assert.equal(createdmarker.owner.profile_link, 'http://instagram.com/kookeetleef');
      assert.equal(createdmarker.owner.profile_picture, sample.user.profile_picture);
      assert.equal(createdmarker.owner.fullname, sample.user.full_name);


      done();
    }).done();
  });

});

describe('Instgram import one marker2', function () {
  before(function (done) {
    TestMarkerUtils.seedPlantLoginAndGetRandomPlant().then(function (m) {
      done();
    });
  });


  it('test importing one marker2', function (done) {
    this.timeout(5000);
    sample2.id = new Date().getTime();
    MarkerImporter.importMarker(sample2, []).then(function (createdmarker) {
      console.log(JSON.stringify(createdmarker));
      assert.equal(createdmarker.source_link, sample2.link);
      assert.equal(createdmarker.source_id, sample2.id);
      console.log(createdmarker.location.address)



      done();
    }).done();
  });

});

describe('Instgram import', function () {

  before(function (done) {

    TestMarkerUtils.seedPlantLoginAndGetRandomPlant().then(function (m) {
      done();
    });
  });

  it('plants', function (done) {

    PlantMatcher.getPlantsToMath().then(function (plants) {
      console.log(plants);

      assert.equal(plants[0].tomatch[0], 'Rubusparvifolius');
      done();
    });
  });
});


describe('Instgram import', function () {

  var plants;
  before(function (done) {

    TestMarkerUtils.seedPlantLoginAndGetRandomPlant().then(function (m) {
      PlantMatcher.getPlantsToMath().then(function (m) {
        plants = m;
        done();
      });
    });
  });

  it('test plant mathing', function (done) {

    this.timeout(10000);
    sample.tags = [
      "wildfood",
      "Rubusparvifoliu",
      "harvesting"
    ];
    MarkerImporter.importMarker(sample, plants).then(function (createdmarker) {
      console.log(JSON.stringify(createdmarker));
      assert.equal(createdmarker.plant.scientificName, 'Rubus parvifolius');
      done();
    }).done();
  });
});







