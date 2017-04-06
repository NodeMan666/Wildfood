var Importer = require('./importer');
var Q = require("q");
var schedule = require('node-schedule');


var rule = '0 */5 * * * *';
//var rule = '*/1 * * * *';
//limited to 5000 requests per hour per access_token or client_id overall.
var j = schedule.scheduleJob(rule, function () {
  exports.run(true);
});

exports.run = function (automaticRun) {
  var deferred = Q.defer();
  var maxPages =1;

  Importer.import(maxPages,automaticRun).then(function (results) {
    deferred.resolve(results);
  }, function (err) {
    deferred.reject(err);
  })
  return deferred.promise;
}


