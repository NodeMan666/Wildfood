var Importer = require('./importer.job');
var assert = require("assert")
var Q = require("q");
var TestUserUtils = require('./../test/test.user.utils.js');
var TestMarkerUtils = require('./../test/test.marker.utils.js');

describe('import job', function () {
  before(function (done) {
    //
    //TestUserUtils.clearAll().then(function (m) {
    //  TestUserUtils.createUserAndLogin().then(function (m) {
    //    done();
    //  });
    //});

    //TestUserUtils.clearUsers().then(function (m) {
    //  TestUserUtils.createUserAndLogin().then(function (m) {
    //    done();
    //  });
    //});
    done();
  });

  //it.skip('Run import job', function (done) {
  //  this.timeout(100000);
  //  Importer.run().then(function (results) {
  //    done();
  //  }).done();
  //
  //});
});

