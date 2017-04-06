'use strict';

var express = require('express');
var controller = require('./common.controller');

var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/fullsearch', controller.globalsearch);
router.post('/postimage',controller.postimage);
router.get('/places',controller.searchPlace);
router.get('/places/:id',controller.getplace);
router.get('/reversegeocode',controller.reserseGeoCode);

module.exports = router;
