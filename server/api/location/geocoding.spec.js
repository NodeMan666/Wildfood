'use strict';

var should = require('should');
var assert = require("assert")


var GeoService = require('./geocoding.service.js');


describe('Geocoding tests', function () {

  describe('get address from location', function () {
    it('should respond with an address', function (done) {
      GeoService.reverseGeoCode([151.211547, -33.866473]).then(function (address) {
        console.log(address);
        assert.equal(address.country.short_name, "AU");
        assert.equal(address.state.short_name, "NSW");
        assert.equal(address.locality.short_name, "Sydney");
        assert.equal(address.country.long_name, "Australia");
        assert.equal(address.state.long_name, "New South Wales");
        assert.equal(address.locality.long_name, "Sydney");
        assert.equal(address.formatted_short, "Sydney NSW AU");
        assert.equal(address.formatted_long, "Sydney, New South Wales, Australia");
        done();
      })
    });

    it('should respond with an address2', function (done) {
      GeoService.reverseGeoCode( [ 145.192226, -37.713767]).then(function (address) {
        console.log(address);
        assert.equal(address.country.short_name, "AU");
        assert.equal(address.state.short_name, "VIC");
        assert.equal(address.locality.short_name, "Research");
        assert.equal(address.country.long_name, "Australia");
        assert.equal(address.state.long_name, "Victoria");
        assert.equal(address.locality.long_name, "Research");
        assert.equal(address.formatted_short, "Research VIC AU");
        assert.equal(address.formatted_long, "Research, Victoria, Australia");
        done();
      })
    });
  });

  describe('no address found', function () {
    it('should respond with an address', function (done) {
      GeoService.reverseGeoCode( [2,1]).then(function (address) {
        console.log(address);
        assert.equal(address.formatted_short, "Unknown location");
        assert.equal(address.formatted_long, "Unknown location");
        done();
      })
    });
  });

});
