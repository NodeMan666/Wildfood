var PlantMatcher = require('./plantmatcher');
var assert = require("assert")

var TestUserUtils = require('./../test/test.user.utils.js');
var TestMarkerUtils = require('./../test/test.marker.utils.js');

describe('plant matching', function () {


  it('single match', function (done) {

    var sample = {
      tags: [
        "wildfood",
        "dandelions",
        "harvesting"
      ]
    };
    var plants = [{
      _id: 1234,
      tomatch: ["dandelion", "taraxu", "#dandelion"]
    }];

    PlantMatcher.matchPlant(sample, plants).then(function (plant) {
      assert.equal(plant, 1234);
      console.log(plant);
      done();
    })
  });

  it('no match', function (done) {

    var sample = {
      tags: [
        "wildfood",
        "dgdgd",
        "harvesting"
      ]
    };
    var plants = [{
      _id: 1234,
      tomatch: ["dandelion", "taraxu", "#dandelion"]
    }];

    PlantMatcher.matchPlant(sample, plants).then(function (plant) {
      console.log(plant);
      assert(plant == null);
      done();
    })
  });

  it('multi match', function (done) {

    var sample = {
      tags: [
        "wildfood",
        "oxalis",
        "harvesting"
      ]
    };
    var plants = [{
      _id: 1,
      tomatch: ["oxalis", "taraxu", "#dandelion"]
    }, {
      _id: 2,
      tomatch: ["dandelion", "oxalis taraxu", "#dandelion"]
    }, {
      _id: 3,
      tomatch: ["dandelion", "taraxu oxalis", "#dandelion"]
    }];

    PlantMatcher.matchPlant(sample, plants).then(function (plant) {
      console.log(plant);
     assert.equal(plant, 1);
      done();
    })
  });

  it('multi match2', function (done) {

    var sample = {
      tags: [
        "wildfood",
        "oxalis",
        "harvesting"
      ]
    };
    var plants = [{
      _id: 1,
      tomatch: ["dddd", "taraxu", "#dandelion"]
    }, {
      _id: 2,
      tomatch: ["dandelion", "oxalis taraxu", "#dandelion"]
    }, {
      _id: 3,
      tomatch: ["dandelion", "taraxu oxalis", "#dandelion"]
    }];

    PlantMatcher.matchPlant(sample, plants).then(function (plant) {
      console.log(plant);
      assert.equal(plant, 2);
      done();
    })
  });


});

