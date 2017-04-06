var userrefresher = require('./userrefresher');
var Q = require("q");
var schedule = require('node-schedule');

//var rule = new schedule.RecurrenceRule();
//every day at 1220 am
var rule = '20 0 * * *';
//var rule = '0 */5 * * * *';

var j = schedule.scheduleJob(rule, function () {
  exports.run(true);
});

exports.run = function (automaticRun) {
  console.log("scheduling user refresh");
  var deferred = Q.defer();

  userrefresher.refreshExistingUsers(automaticRun).then(function (results) {
    deferred.resolve(results);
  }, function (err) {
    deferred.reject(err);
  })
  return deferred.promise;
}



