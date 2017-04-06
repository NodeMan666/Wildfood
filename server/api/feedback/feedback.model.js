'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
  title: String,
  name: String,
  email: String,
  text: String,
  deviceDetail: String,
  type: String, //FEEDBACK,CONTACT, etc
  app: String,
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Feedback', FeedbackSchema);