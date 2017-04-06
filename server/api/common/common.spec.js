'use strict';

var should = require('should');
var assert = require("assert")

var app = require('../../app');
var request = require('supertest');
var Q = require("q");
var TestUserUtils = require('./../../test/test.user.utils.js');
var TestMarkerUtils = require('./../../test/test.marker.utils.js');
var Mocks = require('./../../test/mocks');


describe('Common controller tests', function () {
  var markers;
  before(function (done) {
    this.timeout(3000);
    TestMarkerUtils.seedDbForSearch().then(function (a) {
      done();
      markers = a;
    }).done();
  });

  describe('GET /api/common/fullsearch', function () {

    it('should respond with search results', function (done) {
      TestMarkerUtils.searchAll({
        search: 'yep'
      }).then(function (result) {
        console.log(result);
        assert.equal(result.markers.length, 1);
        done();
      }).done();
    });

    it('should respond with search results', function (done) {
      TestMarkerUtils.searchAll({
        search: 'Raspberry'
      }).then(function (result) {
        console.log(result);
        assert.equal(result.markers.length, 0);
        assert.equal(result.plants.length, 1);
        done();
      }).done();
    });

    it('should respond with search results', function (done) {
      TestMarkerUtils.searchAll({
        search: 'Raspberry'
      }).then(function (result) {
        console.log(result);
        assert.equal(result.markers.length, 0);
        assert.equal(result.plants.length, 1);
        done();
      }).done();
    });

    it('should respond with search results', function (done) {

      //  this.timeout(1000000)
      TestMarkerUtils.searchAll({
        search: 'Test User'
      }).then(function (result) {
        console.log(result);
        assert.equal(result.markers.length, 0);
        assert.equal(result.plants.length, 0);
        assert.equal(result.users.length, 1);
        done();
      }).done();
    });
  });


});
