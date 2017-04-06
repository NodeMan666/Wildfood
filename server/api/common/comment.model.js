/**
 * Created by rhys on 15/11/2014.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Image= require('./../common/image.model');

var Comment = new Schema ({
  text:               String,
  images:            [Image.schema],
  owner:              { type:Schema.Types.ObjectId, ref: 'User'},
  created:            { type: Date, default: Date.now },
  updated:            { type: Date, default: Date.now }
});


module.exports = mongoose.model('Comment', Comment);
