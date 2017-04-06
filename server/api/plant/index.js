'use strict';

var express = require('express');
var controller = require('./plant.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

/* GETs */
router.get('/', controller.index); /* Get a list of plants based upon query params */
router.get('/myfavorites', auth.isAuthenticated(), controller.myfavorites);
router.get('/:id', controller.show); /* Get a single plant by :id */

router.get('/full/:id', auth.hasRole('admin'), controller.showFull);

/* POSTs */
router.post('/', auth.hasRole('admin'), controller.create); /* Create a plant - requires admin */
/* PUTs */
router.put('/:id', auth.hasRole('admin'), controller.update); /* Update a plant - requires admin */
/* DELETEs */
router.delete('/:id', auth.hasRole('admin'), controller.destroy); /* Delete a plant - requires admin */

module.exports = router;
