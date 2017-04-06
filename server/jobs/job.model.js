'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var InstagramjobSchema = new Schema({
  totalToProcess: Number,
  totalProcesssable: Number,
  numberOfSuccesfullyProcessed: Number,
  numberOfSkipped: Number,
  numberOfAlreadyProcessed: Number,
  numberOfProcessedWithException: Number,
  jobParams: Schema.Types.Mixed,
  searchTags: [String],
  processedMarkerIds: [{type: Schema.Types.ObjectId, ref: 'Marker'}],
  exceptions: [{
      title:String,
      exception:String
  }],
  automaticRun: Boolean,
  success: Boolean,
  executionTime: String,
  jobname: String,
 // error: Error,
  executionDateTime: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Job', InstagramjobSchema);
