var Migrator = require('./plantmigrator');
var assert = require("assert")

var TestUserUtils = require('./../test/test.user.utils.js');
var TestMarkerUtils = require('./../test/test.marker.utils.js');

describe('migrator', function () {
  var user;
  var plant = {
    "id": "106",
    "name": "African Love-grass",
    "species": "Eragrostis curvula",
    "description": "",
    "notes": "A variable species complex. Valued for soil conservation and fodder or regarded as a serious weed. Introduced for soil stabilisation. Common on sandy soils; capable of resisting drought and heavy grazing. Successfully competes with low growing weeds such as Spiny Burrgrass Cenchrus species and Caltrop Tribulus terrestris. Many early introductions were of low palatability. 'Consol' is a cultivar selected for palatability. Seedlings grow rapidly after summer rain and strategies to control it depend on providing unfavourable conditions in summer. Serious weed of road verges and may form dense swards crowding out more desirable species in pasture or environmental areas.",
    "known_hazards": "fafa",
    "edible_parts": "Seed - cooked or used as a grain",
    "medicinal_uses": "dggdgd",
    "medicinal_information": "gddggd",
    "other_uses": "Basketry; Biomass; Soil stabilization. A deep-rooted plant, it is considered excellent for protecting terraces and for grassing water channels and is valuable for erosion control. Valuable as mine sites rehabilitation. In Lesotho, this grass is used to make baskets, brooms, hats, ropes, and candles, and it is used for food, as a charm, and in funeral rituals.",
    "other_information": "",
    "ala_link": "http://bie.ala.org.au/species/urn:lsid:biodiversity.org.au:apni.taxon:321371",
    "wiki_link": "http://en.wikipedia.org/wiki/Eragrostis_curvula",
    "marker_count": "0",
    "subspecies": "adsggdsa",
    "family": "Poaceae",
    "origin": "gdsagdsa",
    "habitat": "Arable land and road sides.",
    "physical_characteristics": "Tufted, often tussocky, perennial grass to about 1.5 m tall. Leaves hairless or with soft hairs having wart-like bases; appendage at base of leaf (ligule) a hairy rim to 1 mm long; blade about 3 mm wide. Seeds cream to brown about 1 mm long.\r\nFlowers: Seed Head: Up to 30 cm long. Flowers mostly summer to autumn, but spring burning will promote rapid growth to full maturity in early summer. The flowers are hermaphrodite (has both male and female organs) and are pollinated by Apomictic (reproduce by seeds formed without sexual fusion), wind. The plant is self-fertile.",
    "distinguishing_features": "Distinguished by erect, open or compact seedhead, that has a lead-grey or grey-green appearance (see photo) and leaf tips that are often curly",
    "edibility_rating": "1000",
    "warnings": "Extended use of this plant, either medicinally or in the diet, can cause \r\nallergic skin rashes or lead to photosensitivity in some people. Theoretically yarrow can enhance the sedative effects of other \r\nherbs (e.g. valerian, kava, German chamomile, hops) & sedative \r\ndrugs. Possible sedative & diuretic effects from ingesting large \r\namounts.",
    "medicinal_rating": "1",
    "images": [
      {
        "id": "1049",
        "low_resolution": {
          "url": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Starr_050208-3897_Eragrostis_curvula.jpg/359px-Starr_050208-3897_Eragrostis_curvula.jpg",
          "width": 0,
          "height": 0
        },
        "thumbnail": {
          "url": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Starr_050208-3897_Eragrostis_curvula.jpg/179px-Starr_050208-3897_Eragrostis_curvula.jpg",
          "width": 0,
          "height": 0
        },
        "standard_resolution": {
          "url": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Starr_050208-3897_Eragrostis_curvula.jpg/449px-Starr_050208-3897_Eragrostis_curvula.jpg",
          "width": 0,
          "height": 0
        },
        "image_credit": "Forest & Kim Starr",
        "image_credit_link": "http://www.starrenvironmental.com"
      }
    ],

    "alternative_names": [
      {
        "id": "2",
        "name": "Boreal yarrow"
      }

    ]
  };

  beforeEach(function (done) {
    TestMarkerUtils.clearAll().then(function (m) {
      TestUserUtils.clearUsersAndCreateAdmin().then(function (m) {
        TestUserUtils.loginAdmin().then(function (m) {
          TestUserUtils.getCurrentUser().then(function (m) {
            user = m;
            done();
          });
        });
      });
    });
    //done();
  });
  //
  //it.skip('migrate plants', function (done) {
  //  this.timeout(1000000);
  //  Migrator.migratePlants(user._id).then(function (result) {
  //    done();
  //  }, function (err) {
  //    console.log(err);
  //  })
  //});

  it('migrate one plant', function (done) {
  //  this.timeout(10000);

    Migrator.importPlant(plant, user._id).then(function (returnplant) {
      console.log(JSON.stringify(returnplant));
      assert.equal(returnplant.scientificName, plant.species);
      assert.equal(returnplant.family, plant.family);
      assert.equal(returnplant.localisedProfile.en_au.habitat, plant.habitat);
    //  console.log(plant.physical_characteristics);
     // console.log("------------")
      console.log(returnplant.characteristics);
      assert.notStrictEqual(returnplant.characteristics, "Tufted, often tussocky, perennial grass to about 1.5 m tall. Leaves hairless or with soft hairs having wart-like bases; appendage at base of leaf (ligule) a hairy rim to 1 mm long; blade about 3 mm wide. Seeds cream to brown about 1 mm long. Flowers: Seed Head: Up to 30 cm long. Flowers mostly summer to autumn, but spring burning will promote rapid growth to full maturity in early summer. The flowers are hermaphrodite (has both male and female organs) and are pollinated by Apomictic (reproduce by seeds formed without sexual fusion), wind. The plant is self-fertile.");

      assert.equal(returnplant.localisedProfile.en_au.distinguishing_features, plant.distinguishing_features);
      assert.equal(returnplant.localisedProfile.en_au.origin, plant.origin);
      assert.equal(returnplant.localisedProfile.en_au.commonNames[0], plant.name);
      assert.equal(returnplant.localisedProfile.en_au.commonNames[1], plant.alternative_names[0].name);
      assert.equal(returnplant.images[0].versions.low.url, plant.images[0].low_resolution.url);
      assert.equal(returnplant.images[0].versions.standard.url, plant.images[0].standard_resolution.url);
      assert.equal(returnplant.images[0].versions.thumb.url, plant.images[0].thumbnail.url);
      assert.equal(returnplant.localisedProfile.en_au.edibility.description, plant.edible_parts);
      assert.equal(returnplant.edibility.rating, plant.edibility_rating);
      assert.equal(returnplant.localisedProfile.en_au.medicinalProfile.description, plant.medicinal_uses +" " +plant.medicinal_information);
      assert.equal(returnplant.medicinalProfile.rating, plant.medicinal_rating);
      assert.equal(returnplant.localisedProfile.en_au.otherUses.description, plant.other_uses);
      assert.equal(returnplant.localisedProfile.en_au.notes[0].text, plant.notes);
      assert.equal(returnplant.localisedProfile.en_au.warnings[0].text, plant.known_hazards);
      assert.equal(returnplant.localisedProfile.en_au.warnings[1].text, "Extended use of this plant, either medicinally or in the diet, can cause allergic skin rashes or lead to photosensitivity in some people. Theoretically yarrow can enhance the sedative effects of other herbs (e.g. valerian, kava, German chamomile, hops) & sedative drugs. Possible sedative & diuretic effects from ingesting large amounts.");
      done();
    }).done();
  });

  it('migrate plants array', function (done) {

    Migrator.imporPlants([plant], user._id).then(function (results) {
      assert.equal(results.length, 1);
      done();
    }).done();
  });

});

