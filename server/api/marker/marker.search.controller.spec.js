'use strict';

var should = require('should');
var assert = require("assert")

var app = require('../../app');
var request = require('supertest');
var Q = require("q");
var TestUserUtils = require('./../../test/test.user.utils.js');
var TestMarkerUtils = require('./../../test/test.marker.utils.js');
var Mocks = require('./../../test/mocks');


describe('Marker search tests', function () {
  var markers;
  before(function (done) {
    this.timeout(3000);
    TestMarkerUtils.seedDbForSearch().then(function (a) {
      markers = a;
      done();
    });
  });

  it('no params', function (done) {
    TestMarkerUtils.searchMarkers().then(function (result) {
      result.should.be.instanceof(Array);
      assert(result.length >= 2);
      done();
    }).done();
  });

  it('search string', function (done) {
    TestMarkerUtils.searchMarkers({
      search: 'yep'
    }).then(function (result) {
      assert.equal(result.length, 1);
      done();
    }).done();
  });

  it('search by plant', function (done) {
    TestMarkerUtils.searchMarkers({
      plant: markers[0].plant._id
    }).then(function (result) {
      assert.equal(result.length, 1);
      console.log(result[0])
      assert(result[0].plant.commonNames!=null);
      assert(result[0].plant.scientificName!=null);
      done();
    }).done();
  });

  it('search plant_unknown', function (done) {
    TestMarkerUtils.searchMarkers({
      plant_unknown: 'true'
    }).then(function (result) {
      assert.equal(result.length, 0);
      done();
    }).done();
  });

  it('search active', function (done) {
    TestMarkerUtils.searchMarkers({
      active: 'false'
    }).then(function (result) {
      assert.equal(result.length, 0);
      done();
    }).done();
  });

  it('search verified', function (done) {
    TestMarkerUtils.searchMarkers({
      verified: 'true'
    }).then(function (result) {
      assert.equal(result.length, 0);
      done();
    }).done();
  });

  it('get marker for user', function (done) {
    TestMarkerUtils.searchMarkers({
      owner: '54d87a0d73713af479401276'
    }).then(function (result) {
      assert.equal(result.length, 0);
      done();
    }).done();
  });


});



