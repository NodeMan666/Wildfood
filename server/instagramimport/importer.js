var Instagram = require('instagram-node-lib');
var Q = require("q");
var Marker = require('./../api/marker/marker.model.js');
var User = require('../api/user/user.model');
var Plant = require('./../api/plant/plant.model.js');
var app = require('../app');
var moment = require('moment');
var PlantMatcher = require('./plantmatcher');
var PromiseUtils = require('./promiseUtils');
var MarkerImporter = require('./markerImporter');
var Config = require('./../config/environment');
var JobController = require('./../jobs/job.controller');



exports.import = function (max,automaticRun) {
  var maxPages = max || 1;
  console.log("----------------------------------------------------------------")
  console.log("START MARKERS IMPORT "+ new Date())
  console.log("job params:");
  console.log("timeout between markers:" +Config.jobs.importmarkers.timeout);
  console.log("maxPages:" +maxPages);
  console.log("----------------------------------------------------------------")
  var deferred = Q.defer();
  var start = moment();


  PlantMatcher.getPlantsToMath().then(function (plants) {


    var tags = Config.jobs.importmarkers.tags;

    PromiseUtils.runAsyncFnBasedOnArray(tags, importWithTag, {
      plants: plants,
      maxpages: maxPages
    }).then(function (results) {
      try {
        JobController.printResults({tags:tags, maxPages:maxPages, timeout: Config.jobs.importmarkers.timeout}, start, results, "Markers instagram import",automaticRun);
        deferred.resolve(results);
      }catch(err){
        console.log(err);
        deferred.reject(err);
      }

    }, function (err) {
      deferred.reject(err);
    });
  });


  return deferred.promise;

}

function importWithTag(tag, params) {
  var deferred = Q.defer();
  Instagram.set('client_id', Config.instagram.client_id);
  Instagram.set('client_secret', Config.instagram.client_secret);

  var instaparams = {
    name: tag, error: function (errorMessage, errorObject, caller) {
      console.log(errorMessage);
    }
  }

  if (params.max_tag_id) {
    instaparams.max_tag_id = params.max_tag_id;
  }

  instaparams.complete = function (data, pagination) {
    exports.onInstagramResponse(deferred, params, data, pagination, tag);
  }

  console.log("calling instagram (page " + ((params.currentpage || 0) + 1) + ")", instaparams)
  Instagram.tags.recent(instaparams);

  return deferred.promise;
}


exports.onInstagramResponse = function (deferred, params, data, pagination, tag) {
  // console.log(pagination);
  //console.log(JSON.stringify(data));

  params.max_tag_id = pagination.next_max_tag_id;
  params.currentpage = (params.currentpage || 0 ) + 1;

  PromiseUtils.runAsyncFnBasedOnArray(data, MarkerImporter.importIfPossible, params.plants).then(function (results) {
    //should also check if all the markers have already been imported
    // console.log(results);
    // console.log();
    var r = JobController.parseImportResults(results);
    if ((params.currentpage < params.maxpages) && r.markerids.length > 0) {
      importWithTag(tag, params).then(function (otherresults) {
        var allresults = results.concat(otherresults);
        deferred.resolve(allresults);
      });
    } else {
      deferred.resolve(results);
    }
  });
}
