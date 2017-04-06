'use strict';

var should = require('should');
var assert = require("assert")

var app = require('../../app');
var request = require('supertest');
var Q = require("q");
var TestUserUtils = require('./../../test/test.user.utils.js');
var TestMarkerUtils = require('./../../test/test.marker.utils.js');
var Mocks = require('./../../test/mocks');


describe('Plant tests', function () {

  describe('edit plant', function () {
    var plant;
    var user;
    before(function (done) {
      this.timeout(100000);
      TestMarkerUtils.seedPlantLoginAdminAndGetRandomPlant().then(function (m) {
        plant = m;
        TestUserUtils.getCurrentUser().then(function (m) {
          user = m;
          done();
        });
      }).done();
    });

    it('edit fields', function (done) {
      this.timeout(100000);
      assert.equal(plant.scientificName, "Rubus parvifolius");
      assert.equal(plant.commonNames[0], "Native Raspberry");
      assert.equal(plant.notes.length, 2);


      TestMarkerUtils.getPlantFull(plant._id).then(function (returnvalue) {

        plant = returnvalue;

        assert.equal(plant.created_by._id, user._id);
        assert.equal(plant.updated_by._id, user._id);

        plant.scientificName = "scientificNameXXX";
        plant.localisedProfile.en_au.commonNames = ["com1", "com2"];
        plant.localisedProfile.en_au.notes = [{alerttype: 'danger', text: "n1"}];
        TestMarkerUtils.updatePlant(plant).then(function (returnvalue) {
          TestMarkerUtils.getPlantFull(plant._id).then(function (returnvalue) {
            console.log(returnvalue);
            assert.equal(returnvalue.scientificName, "scientificNameXXX");
            assert.equal(returnvalue.localisedProfile.en_au.commonNames[0], "com1");
            assert.equal(returnvalue.localisedProfile.en_au.commonNames[1], "com2");
            assert.equal(returnvalue.localisedProfile.en_au.notes[0].text, "n1");
            //     assert.equal(returnvalue.notes[0].alerttype, "danger");
            done();
          }).done();
        }).done();
      }).done();
    });

  });

  describe('test requiring existing plants', function () {
    before(function (done) {
      TestMarkerUtils.seedPlants().then(function (a) {
        done();
      });
    });
    ;


    describe('GET /api/plant', function () {
      it('should respond with JSON array', function (done) {
        TestMarkerUtils.httpGet('/api/plant').then(function (plants) {
          plants.data.should.be.instanceof(Array);
          assert(plants.data.length > 0);
          done();
        }).done();


      });
    });
    describe('GET /api/plant?search=Rasp', function () {
      it('should respond with JSON array', function (done) {

        TestMarkerUtils.httpGet('/api/plant?search=Rasp').then(function (plants) {
          plants.data.should.be.instanceof(Array);
          assert(plants.data.length > 0);
          var item = plants.data[0];
          assert(item.commonNames[0].indexOf('Rasp') >= 0);
          assert(item._id.length >= 0);
          done();
        }).done();
      });
    });

    describe('GET /api/plant/:id', function () {
      it('should respond with plant json', function (done) {

        TestMarkerUtils.getRandomPlant().then(function (plant) {
          request(app)
            .get('/api/plant/' + plant._id)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {

              assert(res.body.scientificName.length >= 0);
              assert(res.body._id.length >= 0);
              done();
            });
        });

      });
    });
  });

  describe('create plant', function () {
    before(function (done) {
      TestMarkerUtils.clearAllAndSeedUsers().then(function (t) {
        TestUserUtils.loginAdmin().then(function (token) {
          done();
        });
      });
    });

    describe('create new plant succesfully', function () {
      it('creates a new plant', function (done) {

        TestMarkerUtils.createPlant().then(function (createplant) {
          assert(createplant._id != null);
          done();
        });
      });

      it('test edibility profiles', function (done) {
        var plant = Mocks.plants[0];
        plant.legacyid = null;
        plant.localisedProfile.en_au.edibility = {description: "aaa"};
        plant.edibility = {edible: true, notedible: true, rating: 5};
        plant.edibility.parts = [];
        plant.edibility.parts.push({part: 'roots',
          edible: true, notedible: false
        });
        plant.localisedProfile.en_au.edibility.parts =[];
        plant.localisedProfile.en_au.edibility.parts.push({
          part: 'roots', conditionsOfUse: 'aaaa'
        });

        TestMarkerUtils.addPlant(plant).then(function (returnvalue) {
          console.log(returnvalue);
          assert(returnvalue._id != null);
          assert.equal(returnvalue.localisedProfile.en_au.edibility.description, "aaa");
          assert.equal(returnvalue.edibility.edible, true);
          assert.equal(returnvalue.edibility.notedible, true);
          assert.equal(returnvalue.edibility.rating, 5);
          assert.equal(returnvalue.edibility.parts[0].edible, true);
          assert.equal(returnvalue.edibility.parts[0].notedible, false);
          assert.equal(returnvalue.edibility.parts[0].part, 'roots');
          assert.equal(returnvalue.localisedProfile.en_au.edibility.parts[0].conditionsOfUse, 'aaaa');
          done();
        }).done();
      });

      it('test arrays', function (done) {
        var plant = Mocks.plants[0];
        plant.legacyid = new Date().getTime();
        plant.localisedProfile.en_au.commonNames = ["com1", "com2"];
        TestMarkerUtils.addPlant(plant).then(function (returnvalue) {
          console.log(returnvalue);
          assert(returnvalue._id != null);
          assert.equal(returnvalue.localisedProfile.en_au.commonNames[0], "com1");
          assert.equal(returnvalue.localisedProfile.en_au.commonNames[1], "com2");
          done();
        }).done();
      });

      it('test images', function (done) {
        this.timeout(20000);
        var plant = Mocks.plants[0];
        plant.legacyid = new Date().getTime();
        var imagesadded = [];
        TestMarkerUtils.postimage().then(function (resultimage) {
          imagesadded[0] = resultimage;
          TestMarkerUtils.postimage().then(function (resultimage) {
            imagesadded[1] = resultimage;
            plant.images = imagesadded;
            TestMarkerUtils.addPlant(plant).then(function (returnvalue) {
              console.log(returnvalue);
              assert.equal(returnvalue.images.length, 2);
              assert(returnvalue.images[0].flickr != null);
              done();
            });

          });
        }).done();


      });


    });


    it('add, get, deletePlant', function (done) {
      var plant = Mocks.plants[0];
      TestMarkerUtils.addPlant(plant).then(function (returnvalue) {
        console.log(returnvalue);
        assert(returnvalue._id != null);
        TestMarkerUtils.getPlant(returnvalue._id).then(function (m) {
          assert.equal(m._id, returnvalue._id);
          request(app)
            .delete('/api/plant/' + returnvalue._id)
            .set('Authorization', 'Bearer ' + TestUserUtils.getToken())
            .expect(204)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
              TestMarkerUtils.getPlant(returnvalue._id, 404).then(function (m) {
                console.log("should be null", m);
                assert(m._id == null);
                done();
              });


            });

        }).done();
      }).done();
    });

    //it('should return validation errors when mandatory params missing', function (done) {

  });


});
