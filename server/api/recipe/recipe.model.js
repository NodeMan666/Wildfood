'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Image = require('./../common/image.model');



var RecipeSchema = new Schema({

});

module.exports = mongoose.model('Recipe', RecipeSchema);
