'use strict';
var Migrator = require('./../migration/plantmigrator');
var User = require('./../api/user/user.model');
var Plant = require('./../api/plant/plant.model');
var Jobs = require('./job.model');
var MarkerMigrator = require('./../migration/markermigrator');
var Importer = require('./../instagramimport/importer');
var userrefresher = require('./../instagramimport/userrefresh/userrefresher');
var emailer = require('./../components/email/email.service');
var Paging = require('./../components/paging/paging.utils');
var moment = require('moment');


exports.runJob = function (req, res) {
  console.log("Misc extra task")

  Plant.find().exec(function (err, plants) {

    plants.forEach(function (plant) {

      if (plant.localisedProfile.en_au.commonNames && plant.localisedProfile.en_au.commonNames.length > 0) {
        plant.localisedProfile.en_au.name = plant.localisedProfile.en_au.commonNames[0];
        console.log("set name: " + plant.localisedProfile.en_au.name)
        plant.save();
      }

    })
  });
  return res.json(200, "OK");
}

exports.runPlants = function (req, res) {
  console.log("plant migrationg task")
  //maybe can run it via http.. need to log in first and then run a URL
  User.findOne({"name": 'Admin'},
    function (err, user) {
      console.log("here")
      Migrator.migratePlants(user._id).then(function (result) {
        return res.json(200, "OK");
      }, function (err) {
        console.log(err);
      })
    });
}
exports.runMarkers = function (req, res) {
  console.log("marker migrationg task")
  MarkerMigrator.migrateMarkers().then(function (result) {

  }, function (err) {
    console.log(err);
  })
  return res.json(200, "OK");
}
exports.runMarkersImport = function (req, res) {
  console.log("marker import task");

  var max = req.query.maxpages || null;
  Importer.import(max).then(function (result) {
  }, function (err) {
    console.log(err);
  })
  return res.json(200, "OK");
}

exports.runUserRefresh = function (req, res) {
  console.log("runUserRefresh task");
  userrefresher.refreshExistingUsers().then(function (result) {
  }, function (err) {
    console.log(err);
  })
  return res.json(200, "OK");
}

exports.getLatestJobs = function (req, res) {
  var cond = {};
  if (req.query.job) {
    cond.jobname = req.query.job;
  }
  Jobs.count(function (err, count) {
    Jobs.find(cond)
      .sort({executionDateTime: 'desc'})
      .skip(Paging.getSkip(req))
      .limit(Paging.getLimit(req))
      .exec(function (err, jobs) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, Paging.populatePagedResults(jobs, req, count));
      });
  });

}
function handleError(res, err) {
  console.log("ERROR", err);
  return res.send(500, err);
}

exports.saveJobDetails = function (r, string) {
  r.jobname = string;
  var job = new Jobs(r)
  //getMethodTime(m),
  job.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
}


function getMethodTime(m) {
  var min = m.format('mm');
  var sec = m.format('ss');
  var t = min + "m " + sec + "s";
  return t;
}


exports.printResults = function (jobParams, start, results, string, automaticRun) {
  var r = getResults(results, start);

  r.automaticRun = automaticRun;
  r.jobParams = jobParams;

  exports.saveJobDetails(r, string);

  var output = "";


  output = append(output, "----------------------------------------------------------------")
  output = append(output, "JOB FINISHED :" + string + " : " + new Date());
  output = append(output, "----------------------------------------------------------------");
  output = append(output, "Tried processing : \t" + r.totalToProcess);
  output = append(output, "Total processsable : \t" + r.totalProcesssable);
  output = append(output, "No Processed: \t\t\t" + r.numberOfSuccesfullyProcessed);
  output = append(output, "No Already processed: \t" + r.numberOfAlreadyProcessed);
  output = append(output, "No Exceptions : \t" + r.numberOfProcessedWithException);
  output = append(output, "No Skipped: \t" + r.numberOfSkipped);
  output = append(output, "job params: \t" + JSON.stringify(r.jobParams));

  if (r.exceptions && r.exceptions.length > 0) {
    r.exceptions.forEach(function (ex) {
      output = append(output, "Exception: " + ex.title + ", " + JSON.stringify(ex.exception
      ));
    })

  }


  output = append(output, "Job took: \t\t\t\t" + r.executionTime);
  output = append(output, "----------------------------------------------------------------")
  console.log(output);
  if (r.exceptions && r.exceptions.length > 0) {
    var data = {
      from: 'jobs@wildfood.me',
      subject: "Job had exceptions",
      text: output
    }
    emailer.sendEmailTo("sallamankinen@hotmail.com", data)
  }

}

function append(string, toappend) {
  return string + toappend + "\n";
}


function getResults(results, start) {

  var parsed = exports.parseImportResults(results);
  var m = moment().subtract(start);
  var total = (parsed.markerids.length + parsed.couldnotimport.length + parsed.alreadyimported.length);
  return {
    numberOfSuccesfullyProcessed: parsed.markerids.length,
    processedMarkerIds: parsed.markerids,
    markerids: parsed.markerids,
    executionTime: getMethodTime(m),
    numberOfSkipped: parsed.couldnotimport.length,
    numberOfAlreadyProcessed: parsed.alreadyimported.length,
    numberOfProcessedWithException: parsed.numberOfProcessedWithException.length,
    exceptions: parsed.exceptions,
    totalToProcess: total,
    totalProcesssable: total - parsed.couldnotimport.length,
    success: true
  }
}


exports.parseImportResults = function (results) {
  var markerids = [];
  var couldnotimport = [];
  var alreadyimported = [];
  var numberOfProcessedWithException = [];
  var exceptions = [];

  function processItem(ss) {
    if (ss && ss._id) {
      markerids.push(ss._id);
    } else if (ss && ss.status == 1) {
      couldnotimport.push(ss);
    } else if (ss && ss.status == 3) {
      exceptions.push({
        title: ss.text,
        exception: ss.error + ""
      });
      numberOfProcessedWithException.push(ss);

    } else if (ss && ss.status == 2) {
      alreadyimported.push(ss);
    }
  }

  results.forEach(function (r) {
      if (r != null) {
        if (Array.isArray(r)) {
          r.forEach(function (ss) {
              processItem(ss);
            }
          )
        } else {
          processItem(r);
        }
      }
    }
  )
  return {
    markerids: markerids, couldnotimport: couldnotimport, alreadyimported: alreadyimported,
    exceptions: exceptions, numberOfProcessedWithException: numberOfProcessedWithException
  };
}
