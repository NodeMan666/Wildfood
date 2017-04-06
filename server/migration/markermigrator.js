'use strict';
var Q = require("q");
var MarkerController = require('./../api/marker/marker.controller');
var Marker = require('./../api/marker/marker.model');
var User = require('../api/user/user.model');
var Plant = require('./../api/plant/plant.model.js');
var request = require("superagent");
var moment = require('moment');
var PromiseUtils = require('./../instagramimport/promiseUtils');
var PlantMatcher = require('./../instagramimport/plantmatcher');
var Config = require('./../config/environment');

var UserUtils = require('../auth/user.utils');
var ImportUtils = require('./../instagramimport/importUtils');
var JobController = require('./../jobs/job.controller');

var baseurl = "http://wildedibles.info/api/v2/";
var url = baseurl + "getMarkers.php?verified=both";

exports.migrateMarkers = function () {
    var deferred = Q.defer();
    console.log("-------------------------------");
    console.log("MIGRATE MARKERS START " + new Date());
    console.log("job params:");
    console.log("timeout between markers:" + Config.jobs.migratemarkers.timeout);
    console.log("pagesize:" + Config.jobs.migratemarkers.pagesize);
    console.log("maxpage:" + +Config.jobs.migratemarkers.maxpage);
    console.log("-------------------------------");

    var start = moment();


    exports.migratePageOfMarkers({}).then(function (results) {
        JobController.printResults({
          pagesize:Config.jobs.migratemarkers.pagesize,
          maxpage:Config.jobs.migratemarkers.maxpage,
          timeout: Config.jobs.migratemarkers.timeout
        }, start, results, "markers migration");
        deferred.resolve(null);
    }, function (err) {
        console.log(err);
        deferred.reject(err);
    }).done();
    return deferred.promise;
}


exports.migratePageOfMarkers = function (params) {

    params.page = (params.page || 1);
    console.log("migratePageOfMarkers");
    var deferred = Q.defer();
    var myurl = url + "&page=" + params.page + "&size=" + Config.jobs.migratemarkers.pagesize;
    console.log(myurl);
    request
        .get(myurl)
        .end(function (error, res) {

            if (res.ok && res.body.data && res.body.data.length > 0
              && params.page < Config.jobs.migratemarkers.maxpage) {
                console.log("server response with markers ", res.body.pagination);
                params.page = res.body.pagination.next_page;
                exports.migrateMarkerList(res.body.data).then(function (results) {
                    exports.migratePageOfMarkers(params).then(function (otherresults) {
                        var allresults = results.concat(otherresults);
                        deferred.resolve(allresults);
                    });
                });
            } else {
              console.log(res.error);
              console.log(res.ok + " server didn't return markers");
                deferred
                    .resolve({});
            }
        });
    return deferred.promise;
}

exports.migrateMarkerList = function (markers) {
    var deferred = Q.defer();
    var counter = 0;
    console.log(markers.length + " markers to import");

    PlantMatcher.getPlantsToMath().then(function (plants) {
        return PromiseUtils.runAsyncFnBasedOnArray(markers, exports.importMarkerWithTimeOut, plants).then(function (results) {
            deferred.resolve(results);
        });
    });


    return deferred.promise;
}
exports.importMarkerWithTimeOut = function (marker, plants) {
    var deferred = Q.defer();
    Marker.findOne({$or:[{"legacyid": parseInt(marker.id)}, {"source_id": marker.source_id +""}]},
        function (err, existingmarker) {
            if (err) {
                deferred.reject(err);
            }
            if (existingmarker) {
                //console.log("marker already exists, do nothing");
                deferred.resolve({  status: 2, text: "Exists already"});
            } else {
                var timeoutProtect = setTimeout(function () {
                    timeoutProtect = null;
                    console.log("Importing marker ", JSON.stringify(marker));
                    exports.importMarker(marker, plants).then(function (result) {
                        deferred.resolve(result);
                    }, function (err) {
                        console.log("failed to import " + JSON.stringify(marker), err)
                        delete marker.images;
                        delete marker.location;
                        delete marker.comments;
                        deferred.resolve({status: 3, text: "Exception: " + JSON.stringify(marker) + " " + err, error: err });
                    }).done();

                }, Config.jobs.migratemarkers.timeout);
            }

        });

    return deferred.promise;
}

exports.importMarker = function (marker, plants) {

    var deferred = Q.defer();

    exports.getUser(marker.user).then(function (user) {
      console.log("getUser done")
        exports.getPlant(marker, plants).then(function (plantid) {
            convertComments(marker).then(function (comments) {
                ImportUtils.processLocation(marker).then(function (convertedLocation) {
                    var converted = {
                        legacyid: marker.id,
                        source: marker.source,
                        legacyplantid: marker.plant_id,
                        source_id: marker.source_id,
                        title: marker.title,
                        description: marker.description,
                        active: marker.active,
                        verified: marker.verified,
                        plant_by_user: marker.user_plant,
                        tags: marker.tags,
                        owner: user._id,
                        created_by: user._id,
                        updated_by: user._id,
                        images: [],
                        location: {}
                    };

                    marker.images.forEach(function (image) {
                        converted.images.push(ImportUtils.convertImage(image));
                    });

                    converted.comments = comments;
                    converted.created = ImportUtils.convertDate(marker.created_time);
                    converted.migrated = new Date();
                    converted.plant = plantid;
                    converted.plant_unknown = (marker.unknown == 1) ? true : false;
                    converted.location.position = [marker.location.longitude, marker.location.latitude];

                    if (convertedLocation) {
                        converted.location.address = convertedLocation;
                    }

                    MarkerController.createWithUserMethod(converted).then(function (plant) {

                        deferred.resolve(plant);
                    }, function (err) {
                        deferred.reject(err);
                    }).done();
                }).done();
            }).done();
        }).done();
    }).done();


    return deferred.promise;
}

exports.getPlant = function (marker, plants) {
  console.log("getPlant " + marker.plant_id)

    var deferred = Q.defer();
    if (marker.plant_id && marker.plant_id > 0) {
        Plant.findOne({"legacyid": marker.plant_id},
            function (err, existingplant) {
                if (err) {
                  console.log("existingplant err ",err)
                    deferred.reject(err);
                }
                if (existingplant) {
                  console.log("existingplant found ")
                    deferred.resolve(existingplant._id);
                } else {
                    console.log("plant missing " + marker.plant_id + " " + marker.plant_name)
                    deferred.resolve(null);
                }
            });

    } else {
        PlantMatcher.matchPlant(marker, plants).then(function (plant) {

            deferred.resolve(plant);
        });
    }


    return deferred.promise;
}


function convertComments(marker) {
    console.log("converting comments");
    var deferred = Q.defer();
    if (marker.comments && marker.comments.data && marker.comments.data.length > 0) {
        PromiseUtils.runAsyncFnBasedOnArray(marker.comments.data, convertComment).then(function (results) {
            deferred.resolve(results);
        });

    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
}

exports.getUser = function (profile) {
    var deferred = Q.defer();
    UserUtils.createOrUpdateUserBasedOnOathProfile(User, profile, profile.source, conversionMethod,
            profile.active_user == 0 ? true : false).then(function (user) {
            //return Userrefresher.refreshOurUser(user).then(function (userr) {
            deferred.resolve(user);
            //});
        });
    return deferred.promise;
}

function convertComment(comment) {
    console.log("convertComment:" + JSON.stringify(comment));
    var deferred = Q.defer();
    exports.getUser(comment.from).then(function (user) {
        var result = {
            owner: user._id,
            text: comment.text,
            created: ImportUtils.convertDate(comment.created_time),
            images: []
        };

        comment.images.forEach(function (image) {
            result.images.push(ImportUtils.convertImage(image));
        });


        deferred.resolve(result);
    }, function (err) {
        deferred.reject(err);

    });
    return deferred.promise;


}

function conversionMethod(profile) {


    var user = profile;
    user.name = profile.username;
    user.fullname = profile.full_name;
    user.profile_link = profile.profile_link
    user.profile_picture = profile.profile_picture
    user.id = profile.id
    return user;
}
