var Q = require("q");

exports.runAsyncFnBasedOnArray = function(array, fn, otherparams) {
  var deferred = Q.defer();
  var i = 0;
  var res = [];
  startSequence(res, array, i, fn, otherparams).then(function (results) {
    deferred.resolve(res);
  }, function(err){
    deferred.resolve(err);
  });
  return deferred.promise;
}

function startSequence(res, array, i, fn, otherparams) {
  var deferred = Q.defer();
  sequenceArrayItem(array, i, fn, otherparams).then(function (result) {
    i++;
  //  console.log("done sequenceArrayItem");
    res.push(result);

    if (array.length > i) {
      startSequence(res, array, i, fn, otherparams).then(function (result) {
        //console.log("done startSequence");
        deferred.resolve(result);
      }, function(err){
        deferred.resolve(err);
      });
    } else {
      deferred.resolve(null);
    }

  });
  return deferred.promise;
}


function sequenceArrayItem(array, i, fn, otherparams) {

  var deferred = Q.defer();
 // console.log("start item in array " + i);
  var item = array[i];

  fn(item, otherparams).then(function (result) {
    deferred.resolve(result);
  }, function(err){
    deferred.resolve(err);
  });

  return deferred.promise;
}
//var tags = ['wildfood'];
//var fns = [];
//tags.forEach(function (tag) {
//  fns.push(importWithTag(tag, plants));
//});
//Q.all(fns).then(function (results) {
//  printResults(results);
//  deferred.resolve(null);
//});


//console.log(JSON.stringify(data));
//console.log(data.length);
//var fns = [];
//var count = 0;
//for (var i = 0; i < data.length; i++) {
//  var item = data[i];
//  //
//  if (canBeConverted(item)) {
//    count++;
//    console.log(count);
//    fns.push(exports.importMarker(item, plants));
//  } else {
//    console.log("can't be converted " + JSON.stringify(item));
//  }
//}
//
//Q.all(fns).then(function (result) {
//  deferred.resolve(result);
//});
