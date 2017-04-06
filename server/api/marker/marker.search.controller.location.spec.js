'use strict';

var should = require('should');
var assert = require("assert")
var moment = require("moment")

var app = require('../../app');
var request = require('supertest');
var Q = require("q");
var TestUserUtils = require('./../../test/test.user.utils.js');
var TestMarkerUtils = require('./../../test/test.marker.utils.js');
var Mocks = require('./../../test/mocks');


describe('Marker search by location tests', function () {

  var m1, m2;
  before(function (done) {
    this.timeout(10000000);
    TestMarkerUtils.seedPlantsMultiple().then(function (createdplants) {
      TestUserUtils.getCurrentUser().then(function (user) {
        var Marker = Mocks.getMarker(createdplants[0]._id, user._id);
        //Paddington NSW
        Marker.location.position = [151.229706, -33.882188]

        var Marker2 = Mocks.getMarker2(createdplants[0]._id, user._id);
        //Newcastle NSW
        Marker2.location.position = [151.705573, -32.908101]

        //roughly 170km between them

        TestMarkerUtils.createMarkerFromData(Marker).then(function (marker1) {
          TestMarkerUtils.createMarkerFromData(Marker2).then(function (marker2) {
            m1 = marker1;
            m2 = marker2;
            done();
          });
        }).done();

      }).done();
    }).done();
  });


//                zoomLevel: ''
//            }


  it('return results with geosearch', function (done) {
    //Bellevue Hill NSW 2023
    TestMarkerUtils.searchMarkers({
      lat: '-33.882747',
      long: '151.255224',
      range: '10000'
    }).then(function (result) {
      console.log(JSON.stringify(result));
      assert.equal(result.length, 1);
      assert.equal(result[0]._id, m1._id);
      done();
    }).done();
  });

  it('return no results when not in range', function (done) {
    //Bellevue Hill NSW 2023

    TestMarkerUtils.searchMarkers({
      lat: '-37.569247',
      long: '145.205000',
      range: '50'
    }).then(function (result) {
      assert.equal(result.length, 0);
      done();
    }).done();
  });

  it('return all results when range enough big', function (done) {
    //Bellevue Hill NSW 2023
    TestMarkerUtils.searchMarkers({
      lat: '-33.882747',
      long: '151.255224',
      range: '200000' //200km
    }).then(function (result) {
      assert.equal(result.length, 2);
      done();
    }).done();
  });

  it('return paged results', function (done) {
    //Bellevue Hill NSW 2023
    var params = {
      lat: '-33.882747',
      long: '151.255224',
      range: '200000', //200km
      page: 1,
      size: 1
    };
    TestMarkerUtils.searchPagedMarkers(params).then(function (result) {
      assert.equal(result.data.length, 1);
      assert.equal(result.pagination.page, 1);
      assert.equal(result.pagination.size, 1);
      assert.equal(result.pagination.next_page, 2);
      //assert.equal(result.pagination.itemCount, 1);
      assert.equal(result.data[0]._id, m1._id);

      params.page = 2;
      TestMarkerUtils.searchPagedMarkers(params).then(function (result) {
        assert.equal(result.data.length, 1);
        assert.equal(result.pagination.page, 2);
        assert.equal(result.pagination.size, 1);
        //assert.equal(result.pagination.itemCount, 1);
        assert.equal(result.pagination.next_page, 3);
        assert.equal(result.data[0]._id, m2._id);
        params.page = 3;
        TestMarkerUtils.searchPagedMarkers(params).then(function (result) {
          assert.equal(result.data.length, 0);
          assert.equal(result.pagination.page, 3);
          assert.equal(result.pagination.size, 1);
          //assert.equal(result.pagination.itemCount, 0);
          assert.equal(result.pagination.next_page, -1);

          done();
        }).done();

      }).done();
    }).done();

  })
});


describe('Group by local plants', function () {

  var m1, m2, m3;
  var p1, p2;
  before(function (done) {
    this.timeout(10000000);
    TestMarkerUtils.seedPlantsMultiple().then(function (createdplants) {
      p1 = createdplants[0];
      p2 = createdplants[1];
      TestUserUtils.getCurrentUser().then(function (user) {
        var Marker = Mocks.getMarker(p1._id, user._id);
        Marker.location.position = [151.229706, -33.882188]

        var Marker2 = Mocks.getMarker2(p1._id, user._id);
        Marker2.location.position = [151.229706, -33.882188]

        var Marker3 = Mocks.getMarker2(p2._id, user._id);
        Marker3.location.position = [151.229706, -33.882188]

        TestMarkerUtils.createMarkerFromData(Marker).then(function (marker1) {
          TestMarkerUtils.createMarkerFromData(Marker2).then(function (marker2) {
            TestMarkerUtils.createMarkerFromData(Marker3).then(function (marker3) {
              m1 = marker1;
              m2 = marker2;
              m3 = marker3;
              done();
            });
          }).done();
        }).done();

      }).done();
    }).done();
  });


  it('Order by plants', function (done) {
    TestMarkerUtils.httpGet('/api/plant?lat=-33.882747&long=151.255224&range=10000').then(function (result) {
      console.log(JSON.stringify(result));
      assert.equal(result.data.length, 2);
      assert.equal(result.data[0]._id, p1._id);
      assert.equal(result.data[0].local_tags, 2);
      assert.equal(result.data[1]._id, p2._id);
      assert.equal(result.data[1].local_tags, 1);
      done();
    }).done();
  });

  it('markers by date', function (done) {

    var today = moment();
    var futureDate = moment().add(10, 'days');
    TestMarkerUtils.searchMarkers({
      lat: '-33.882747',
      long: '151.255224',
      range: '1000',
      afterDate: futureDate
    }).then(function (result) {
      assert.equal(result.length, 0);
      done();
    }).done();
  });

  it('markers by date', function (done) {

    var today = moment();
    var oldDate = moment().subtract(10, 'days');
    TestMarkerUtils.searchMarkers({
      lat: '-33.882747',
      long: '151.255224',
      range: '1000',
      afterDate: oldDate
    }).then(function (result) {
      assert.equal(result.length, 3);
      done();
    }).done();
  });


});


describe('Sorting by most recent and location', function () {

  var m1, m2, m3;
  var p1, p2;
  before(function (done) {
    this.timeout(10000000);
    TestMarkerUtils.seedPlantsMultiple().then(function (createdplants) {

      p1 = createdplants[0];
      p2 = createdplants[1];
      TestUserUtils.getCurrentUser().then(function (user) {
        var Marker = Mocks.getMarker(p1._id, user._id);
        Marker.location.position = [151.229706, -33.882188]
        Marker.created = moment().subtract(15, 'days');

        var Marker2 = Mocks.getMarker2(p1._id, user._id);
        Marker.location.position = [151.229706, -33.882188]
        Marker2.created = moment().subtract(5, 'days');

        var Marker3 = Mocks.getMarker2(p2._id, user._id);
        Marker3.location.position = [151.229706, -33.882188]
        Marker3.created = moment().subtract(10, 'days');

        TestMarkerUtils.createMarkerFromData(Marker).then(function (marker1) {
          TestMarkerUtils.createMarkerFromData(Marker2).then(function (marker2) {
            TestMarkerUtils.createMarkerFromData(Marker3).then(function (marker3) {
              m1 = marker1;
              m2 = marker2;
              m3 = marker3;
              done();
            });
          }).done();
        }).done();

      }).done();
    }).done();
  });


  it('sort markers by date', function (done) {
    var oldDate = moment().subtract(11, 'days');
    TestMarkerUtils.searchMarkers({
      lat: '-33.882747',
      long: '151.255224',
      range: '10000',
      sortBy: 'recent'
    }).then(function (result) {
      assert.equal(result.length, 3);
      assert.equal(result[0]._id, m2._id);
      assert.equal(result[1]._id, m3._id);
      assert.equal(result[2]._id, m1._id);
      done();
    }).done();
  });

  it('sort markers by date', function (done) {
    var oldDate = moment().subtract(11, 'days');
    TestMarkerUtils.searchMarkers({
      lat: '-33.882747',
      long: '151.255224',
      range: '10000',
      sortBy: 'recent',
      afterDate: oldDate
    }).then(function (result) {
      assert.equal(result.length, 2);
      assert.equal(result[0]._id, m2._id);
      done();
    }).done();
  });

  it('unusual long lat', function (done) {
   long: '151.255224',
   // lat:33.472272769182396
   // long:273.199198

     //lat: '33.471700000000006',
     // //lat: '33.471700',

    TestMarkerUtils.searchMarkers({
      lat: '33.471700000000006',
      long: '273.199198',
      range: '10000'
    }).then(function (result) {
      assert.equal(result.length, 0);
      done();
    }).done();
  });

});
