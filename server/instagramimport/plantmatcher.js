var Q = require("q");
var Plant = require('./../api/plant/plant.model.js');

exports.getPlantsToMath = function () {
  var deferred = Q.defer();

  Plant.find()
    .exec(function (err, plants) {
      if (err) {
        deferred.reject(err);
      }

      var resultplants = (plants ||[]).map(function (x) {

        var r = {_id: x._id, tomatch: []};
        r.tomatch.push(normalise(x.scientificName));
        x.profile.commonNames.forEach(function (name) {
          r.tomatch.push(normalise(name));
        })

        return r;
      });

      deferred.resolve(resultplants);
    });
  return deferred.promise;
}
function normalise(string) {
  string = string.replace(" ", "");
  return string;
}

exports.matchPlant = function (item, plants) {
  //console.log("matching plant " + JSON.stringify(item), JSON.stringify(plants));
  var deferred = Q.defer();

  var prematch = [];

  if (plants == null) {
    throw new Error("have to have plants");
  }

  plants.forEach(function (plant) {
    plant.tomatch.forEach(function (tomatch) {
      item.tags.forEach(function (tag) {
        if (tag.toLowerCase() == tomatch.toLowerCase()) {
          if (prematch.indexOf(plant) < 0) {
            prematch.push(plant);
          }
        }
        //normaliset stuff, get rid of spaces!!!!

        if (tag.toLowerCase() == (tomatch + "s").toLowerCase()) {
          if (prematch.indexOf(plant) < 0) {
            prematch.push(plant);
          }
        }

        if (tomatch.toLowerCase().indexOf(tag.toLowerCase()) >= 0) {
          if (prematch.indexOf(plant) < 0) {
            prematch.push(plant);
          }
        }
      });
    });
  });

  if (prematch.length > 0) {
    console.log("prematches exist")
    if (prematch.length == 1) {
      deferred.resolve(prematch[0]._id);
    } else {

      var secondmatch = {};

      prematch.forEach(function (plant) {
        secondmatch[plant._id] = 0;
      });

      //gives points, whoever wins gets matched
      prematch.forEach(function (pre) {
        pre.tomatch.forEach(function (tomatch) {
          item.tags.forEach(function (tag) {
           // console.log(tomatch)
            if (tag.toLowerCase() == tomatch.toLowerCase()) {
              secondmatch[tomatch._id] = secondmatch[tomatch._id] + 5;
            }

            if (tag.toLowerCase() == (tomatch + "s").toLowerCase()) {
              secondmatch[tomatch._id] = secondmatch[tomatch._id] + 2;
            }

            if (tomatch.toLowerCase().indexOf(tag.toLowerCase()) >= 0) {
              secondmatch[tomatch._id] = secondmatch[tomatch._id] + 2;
            }
          });
        });
      });

      var winner = {
        _id: prematch[0]._id,
        score: secondmatch[prematch[0]._id]
      };

      prematch.forEach(function (tomatch) {
        if (secondmatch[tomatch._id] > winner.score) {
          winner = {
            _id: tomatch._id,
            score: secondmatch[tomatch._id]
          };
        }
      });

      deferred.resolve(winner._id);
    }


  } else {
    console.log("no matches")
    deferred.resolve(null)
  }


  return deferred.promise;

}
