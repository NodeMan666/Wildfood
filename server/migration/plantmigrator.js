'use strict';
var Q = require("q");
//var User = require('../api/user/user.model');
var Plant = require('./../api/plant/plant.model.js');
var request = require("superagent");
var moment = require('moment');
var ImportUtils = require('./../instagramimport/importUtils');
var JobController = require('./../jobs/job.controller');
var baseurl = "http://wildedibles.info/api/v2/";

exports.migratePlants = function (userid) {
  var start = moment();
  console.log("-------------------------------");
  console.log("migrate plants start");
  console.log("-------------------------------");
  var deferred = Q.defer();
  var url = baseurl + "getPlants2.php";
  console.log(url);
  request
    .get(url)
    .end(function (error, res) {
      if (res.body.plants) {
        var plants = res.body.plants;

        exports.imporPlants(plants, userid).then(function (results) {
            JobController.printResults({
            }, start, results, "plants migration");

          deferred.resolve(results);
        }, function (err) {
          deferred.reject(err);
        });

      } else {
        deferred
          .reject();
      }
    });
  return deferred.promise;
}


exports.imporPlants = function (plants, userid) {
  var deferred = Q.defer();
  var counter = 0;
  console.log(plants.length + " plants to migrate");
  var fns = [];
  plants.forEach(function (plant) {
    counter++;
    console.log("migrate plant " + counter + " " + JSON.stringify(plant));
    fns.push(exports.importPlant(plant, userid));
  });
  Q.all(fns).then(function (results) {
    deferred.resolve(results);
  });

  return deferred.promise;
}


exports.importPlant = function (plant, userid) {
  var deferred = Q.defer();
  Plant.findOne({"legacyid": plant.id},
    function (err, existingplant) {
      if (err) {
        deferred.reject(err);
      }
      if (existingplant) {
        console.log("plant already exists, do nothing");
        deferred.resolve({status: 2, text: "Exists already"});
      }
      var convertedPlant = {
        scientificName: plant.species,
        legacyid: plant.id,
        family: plant.family,
        ala_link: plant.ala_link,
        wiki_link: plant.wiki_link,
        created_by: userid,
        updated_by: userid,
        images: []
      };

      var localised = {
        origin: ImportUtils.cleanText(plant.origin),
        distinguishing_features: ImportUtils.cleanText(plant.distinguishing_features),
        habitat: ImportUtils.cleanText(plant.habitat),
        characteristics: ImportUtils.cleanText(plant.physical_characteristics),
        commonNames: [plant.name],
        description: ImportUtils.cleanText(plant.description),
      }

      convertedPlant.localisedProfile ={
        en_au:localised
      }

      plant.alternative_names.forEach(function (name) {
        localised.commonNames.push(name.name);
      });


      plant.images.forEach(function (image) {
        convertedPlant.images.push(ImportUtils.convertImage(image));
      });

      if (plant.edible_parts && plant.edible_parts != "") {
        convertedPlant.edibility = {
          edible: true
        }
        localised.edibility = {
          description: ImportUtils.cleanText(plant.edible_parts)
        }

        if (plant.edibility_rating > 0) {
          convertedPlant.edibility.rating = plant.edibility_rating;
        }
      }

      if ((plant.medicinal_uses && plant.medicinal_uses != "")
        || (plant.medicinal_information && plant.medicinal_information != "")) {

        var string = "";

        if ((plant.medicinal_uses && plant.medicinal_uses != "")) {
          string = string + ImportUtils.cleanText(plant.medicinal_uses);
          if ((plant.medicinal_information && plant.medicinal_information != "")) {
            string = string + " "+ ImportUtils.cleanText(plant.medicinal_information);
          }

        } else {
          string = string + ImportUtils.cleanText(plant.medicinal_information);
        }

        convertedPlant.medicinalProfile = {
          edible: true
        }
        localised.medicinalProfile = {
          description: string
        }

        if (plant.medicinal_rating > 0) {
          convertedPlant.medicinalProfile.rating = plant.medicinal_rating;
        }
      }

      if (plant.other_uses && plant.other_uses != "") {
        convertedPlant.otherUses = {
          edible: true
        }

        localised.otherUses = {
          description: ImportUtils.cleanText(plant.other_uses)
        }
      }
      if (plant.notes && plant.notes != "") {
        localised.notes = [{
          alerttype : 'info',
          text : ImportUtils.cleanText(plant.notes)
        }]
      }

      localised.warnings = []

      if (plant.known_hazards && plant.known_hazards != "") {
        localised.warnings.push({
          alerttype : 'warning',
          text : ImportUtils.cleanText(plant.known_hazards)
        })
      }

      if (plant.warnings && plant.warnings != "") {
        localised.warnings.push({
          alerttype : 'warning',
          text : ImportUtils.cleanText(plant.warnings)
        })
      }

      Plant.create(convertedPlant, function (err, plant) {
        if (err) {
          deferred.reject(err);
        }
        deferred.resolve(plant);
      });

    });


  return deferred.promise;
}

