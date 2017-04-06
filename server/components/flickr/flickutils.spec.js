'use strict';

var should = require('should');
var assert = require("assert")


var FlickUtils = require('./flickrutils');
var path = require('path');

describe('FlickUtils tests', function () {
  it('upload', function (done) {
    this.timeout(20000);
    var currentdir = path.resolve();
    console.log(currentdir);
    FlickUtils.uploadimage({path: currentdir + "/test/italy.jpg"}).then(function (result) {
      console.log(result);
      assert(result.versions!=null);
      assert(result.versions.thumb!=null);
      assert(result.versions.thumb.url!=null);
      assert(result.versions.thumb.width==150);
      assert(result.versions.thumb.height==150);
      assert(result.versions.low!=null);
      assert(result.versions.low.url!=null);
      assert(result.versions.standard!=null);
      assert(result.versions.standard.url!=null);
      done();
    }).done();
  });


});
