'use strict';

var express = require('express');
var controller = require('./job.controller');
var router = express.Router();

router.get('/extra', controller.runJob);
router.get('/migrateplants', controller.runPlants);
router.get('/migratemarkers', controller.runMarkers);
router.get('/importmarkers', controller.runMarkersImport);
router.get('/refreshusers', controller.runUserRefresh);
router.get('/last', controller.getLatestJobs);

module.exports = router;
