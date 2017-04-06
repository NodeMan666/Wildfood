'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var assert = require("assert")

describe('GET /api/climatezones', function() {

  it.skip('should respond with JSON array', function(done) {
    request(app)
      .get('/api/climatezones')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

    it('respond with climate code', function (done) {
        var lat = -33.894815788265404;
        var long = 151.2073120958985;
        request(app)
            .get('/api/climate/data/koeppen?long=' + long + '&lat=' + lat)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                assert.equal(res.body.bomcode, 9);
                done();
            });
    });
});
