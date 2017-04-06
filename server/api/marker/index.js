'use strict';

var express = require('express');
var controller = require('./marker.controller');
var searchcontroller = require('./marker.search.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

/* GETs */
router.get('/', searchcontroller.index); /* Get a list of markers based upon query params */
//router.get('/recent', searchcontroller.recent); /* Get a list of markers based upon query params */
//don't really need to expose this, just for testing, / is enough
//router.get('/bylocation', searchcontroller.indexByLocation); /* Get a list of markers based upon query params */
router.get('/mymarkers', auth.isAuthenticated(), searchcontroller.mymarkers); //these should be in user.....
router.get('/myfavorites', auth.isAuthenticated(), searchcontroller.myfavorites);//these should be in user.....


router.get('/:id', controller.show); /* Get a single marker by :id */

/* PUTs */
router.put('/:id', auth.isAuthenticated(), controller.update); /* Update a marker - requires authentication */



router.put('/admin/:id', auth.hasRole('admin'), controller.admin); /* Update a marker - requires authentication */

router.post('/:id/comment', auth.isAuthenticated(),controller.addcomment);
router.delete('/:id/comment/:commentid',auth.isAuthenticated(),controller.deletecomment);
//router.put('/:id/comment/:commentid',auth.isAuthenticated(),controller.editComment);


router.post('/:id/likes', auth.isAuthenticated(), controller.like);
router.delete('/:id/likes', auth.isAuthenticated(), controller.unlike);


router.post('/:id/confirms', auth.isAuthenticated(), controller.confirm);
router.delete('/:id/confirms', auth.isAuthenticated(), controller.unconfirm);

/* POSTs */
router.post('/', auth.isAuthenticated(), controller.create); /* Create a marker - requires authentication */


/* DELETEs */
router.delete('/:id', auth.isAuthenticated(), controller.destroy); /* Delete a marker - requires authentication */

module.exports = router;
