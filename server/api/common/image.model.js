/**
 * Created by rhys on 15/11/2014.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Version = {
  url: String,
  width: Number,
  height: Number
};

var Image = new Schema({
  title: String,
  credit: String,
  credit_link: String,
  created: {type: Date, default: Date.now},
  flickr:{
    id: String,
    sizes :[
      {
        label: String,
        width: String,
        height: String,
        source: String
      }
    ]
  },
  versions: {
    thumb:Version,
    standard:Version,
    high:Version,
    low:Version
  }
  ,
  describedParts: {
    overview:                 Boolean,
    roots:                    Boolean,
    stems:                    Boolean,
    bark:                     Boolean,
    leaves:                   Boolean,
    flowers:                  Boolean,
    fruit:                    Boolean
  }
});


module.exports = mongoose.model('Image', Image);
