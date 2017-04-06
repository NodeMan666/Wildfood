'use strict';

var should = require('should');
var assert = require("assert")

var app = require('../../app');
var request = require('supertest');
var Q = require("q");

describe('Error test', function () {
    before(function (done) {
        done();
    });


    describe('GET /api/XXX', function () {

        it('should respond with 404', function (done) {
            request(app)
                .get('/api/XXX')
                .expect(404)
                .end(function (err, res) {
                    console.log(res.body);

                    done();
                });
        });
    });



});

