'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/search',  controller.search);
router.get('/searchall',  controller.searchall);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/updatedetails', auth.isAuthenticated(), controller.updatedetails);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/public/:id', controller.showPublicProfile);
router.post('/', controller.create);



router.post('/me/favoritemarkers/:markerid', auth.isAuthenticated(),controller.addFavoriteMarker);
router.delete('/me/favoritemarkers/:markerid', auth.isAuthenticated(),controller.deleteFavoriteMarker);
router.get('/me/favoritemarkers', auth.isAuthenticated(),controller.getfavoritemarkers);

router.post('/me/favoriteplants/:plantid', auth.isAuthenticated(),controller.addFavoritePlant);
router.delete('/me/favoriteplants/:plantid', auth.isAuthenticated(),controller.deleteFavoritePlant);
router.get('/me/favoriteplants', auth.isAuthenticated(),controller.getfavoriteplants);

module.exports = router;
