'use strict';

var should = require('should');
var assert = require("assert")


var Places = require('./google.places.service.js');


describe('Google places tests', function () {

  describe('search places', function () {
    it('should respond with an address', function (done) {
      Places.searchLocation("sydney").then(function (address) {
        console.log(address);
        //assert.equal(address[0].formatted_address, "Sydney NSW, Australia");
        assert.equal(address[0].description, "Sydney, New South Wales, Australia");
        done();
      }).done();
    });


  });


});
