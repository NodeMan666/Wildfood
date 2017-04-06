'use strict';

var should = require('should');
var assert = require("assert")
var _ = require('lodash');
var app = require('../app');
var request = require('supertest');
var Q = require("q");
var User = require('./../api/user/user.model.js');
var Marker = require('./../api/marker/marker.model.js');
var Plant = require('./../api/plant/plant.model.js');
var Mocks = require('./mocks');
var TestUserUtils = require('./test.user.utils.js');


exports.getFavoriteMarkers = function () {
  return exports.httpGet('/api/users/me/favoritemarkers');

}
exports.getFavoritePlants = function () {
  return exports.httpGet('/api/users/me/favoriteplants');
}

function getDataAsGetParams(data) {

  var first = true;
  var result = "";

  for (var property in data) {
    if (data.hasOwnProperty(property)) {

      var sub = "";
      if (!first) {
        sub = "&";
      }
      var value = data[property];
      value = encodeURI(value);

      result += sub + property + "=" + value;

      first = false;
    }
  }
  console.log(result);
  return result;
}

exports.searchMarkers = function (params) {
  var deferred = Q.defer();
  console.log("searchMarkers");
  var p = '';

  if (params) {
    p = '?' + getDataAsGetParams(params);
  }

  request(app)
    .get('/api/marker' + p)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      deferred.resolve(res.body.data);
    });
  return deferred.promise;
}
exports.searchPagedMarkers = function (params) {
  var deferred = Q.defer();
  console.log("searchMarkers");
  var p = '';

  if (params) {
    p = '?' + getDataAsGetParams(params);
  }

  request(app)
    .get('/api/marker' + p)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      deferred.resolve(res.body);
    });
  return deferred.promise;
}

exports.searchAll = function (params) {
  var deferred = Q.defer();
  console.log("searchAll");

  var p = '';
  if (params) {
    p = '?' + getDataAsGetParams(params);
  }

  return exports.httpGet('/api/common/fullsearch' + p);

}


exports.toggleFavoriteStatus = function (marker, state) {

  if (state) {
    return exports.httpPost('/api/users/me/favoritemarkers/' + marker._id);
  } else {
    return exports.httpDelete('/api/users/me/favoritemarkers/' + marker._id);
  }
}

exports.toggleFavoriteStatusForPlant = function (plant, state) {

  if (state) {
    return exports.httpPost('/api/users/me/favoriteplants/' + plant._id);
  } else {
    return exports.httpDelete('/api/users/me/favoriteplants/' + plant._id);
  }

}
exports.httpDelete = function (url, params) {
  var deferred = Q.defer();
  request(app)
    .delete(url)
    .set('Authorization', 'Bearer ' + exports.getToken())
    .send(params)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {

      if (err) {
        console.log(err);
        deferred.reject(err);
      }
      deferred.resolve(res.body);
    });
  return deferred.promise;
}

exports.httpPost = function (url, params) {
  var deferred = Q.defer();
  request(app)
    .post(url)
    .set('Authorization', 'Bearer ' + exports.getToken())
    .send(params)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {

      if (err) {
        console.log(err);
        deferred.reject(err);
      }
      deferred.resolve(res.body);
    });
  return deferred.promise;
}

exports.httpGet = function (url, toexpect) {
  var deferred = Q.defer();
  request(app)
    .get(url)
    .set('Authorization', 'Bearer ' + exports.getToken())
    .expect(toexpect||200)
    //.expect('Content-Type', /json/)
    .end(function (err, res) {

      if (err) {
        console.log(err);
        deferred.reject(err);
      }
      if(res && res.body){
        deferred.resolve(res.body);
      }else{
        deferred.resolve(null);
      }

    });
  return deferred.promise;
}


exports.addcomment = function (marker, text) {

  console.log("addcomment with ", text);
  var deferred = Q.defer();
  request(app)
    .post('/api/marker/' + marker._id + '/comment')
    .set('Authorization', 'Bearer ' + exports.getToken())
    .send(text)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      deferred.resolve(res.body);

    });
  return deferred.promise;
}
exports.getmarker = function (markerid, returncode) {

  var deferred = Q.defer();
  request(app)
    .get('/api/marker/' + markerid)
    .expect(returncode || 200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {

      if (res && res.body) {
        deferred.resolve(res.body);
      } else {
        deferred.resolve(res);
      }
    });
  return deferred.promise;
}


exports.addMarker = function (marker) {

  console.log("addMarker with ", marker);
  var deferred = Q.defer();
  request(app)
    .post('/api/marker/')
    .set('Authorization', 'Bearer ' + exports.getToken())
    .send(marker)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) {
        console.log(err);
      }
      deferred.resolve(res.body);

    });
  return deferred.promise;
}

exports.updateMarker = function (markerrrr) {

  var props = ['plant', 'plant_by_user', 'plant_unknown', 'description', 'source', 'location', 'images'];

  var marker = _.pick(markerrrr, props);

  console.log("updateMarker with ", JSON.stringify(marker));
  var deferred = Q.defer();
  request(app)
    .put('/api/marker/' + markerrrr._id)
    .set('Authorization', 'Bearer ' + exports.getToken())
    .send(marker)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      deferred.resolve(res.body);
    });
  return deferred.promise;
}

exports.addPlant = function (plant) {

  console.log("addPlant with ", plant);
  var deferred = Q.defer();
  request(app)
    .post('/api/plant')
    .set('Authorization', 'Bearer ' + exports.getToken())
    .send(plant)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      deferred.resolve(res.body);

    });
  return deferred.promise;
}

exports.updatePlant = function (planttoupdate) {

  var plant = _.pick(planttoupdate, ['active', 'wiki_link', 'ala_link', 'notes',
    'warnings', 'danger', 'activeSubstances',
    'distinguishing_features', 'commonNames', 'scientificName', 'family', 'habitat',
    'description', 'characteristics', 'images', 'edibility',
    'medicinalProfile', 'otherUses', 'legacyid', 'permanencyType', 'seasonalProfile','localisedProfile']);

  // var plant = planttoupdate;

  console.log("updatePlant with ", plant);
  var deferred = Q.defer();
  request(app)
    .put('/api/plant/' + planttoupdate._id)
    .set('Authorization', 'Bearer ' + exports.getToken())
    .send(plant)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      deferred.resolve(res.body);
    });
  return deferred.promise;
}

exports.adminMarker = function (markerrrr) {

  var marker = _.pick(markerrrr, ['verified', 'active', 'plant_unknown', 'plant']);

  console.log("adminMarker with ", JSON.stringify(marker));
  var deferred = Q.defer();
  request(app)
    .put('/api/marker/admin/' + markerrrr._id)
    .set('Authorization', 'Bearer ' + exports.getToken())
    .send(marker)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      deferred.resolve(res.body);
    });
  return deferred.promise;
}

exports.addMarkerWithImage = function (marker) {

  var deferred = Q.defer();

  exports.postimage().then(function (resultimage) {
    marker.images = [resultimage];
    exports.addMarker(marker).then(function (res) {
      deferred.resolve(res);
    });
  });

  return deferred.promise;
}


exports.addcommentWithImage = function (marker, text) {

  var deferred = Q.defer();

  exports.postimage().then(function (resultimage) {
    console.log(resultimage);
    text.images = [resultimage];
    exports.addcomment(marker, text).then(function (res) {
      deferred.resolve(res);
    });
  });

  return deferred.promise;
}

exports.postimage = function () {

  var deferred = Q.defer();
  request(app)
    .post('/api/common/postimage')
    .attach('image', 'test/italy.jpg')
    .set('Authorization', 'Bearer ' + exports.getToken())
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      deferred.resolve(res.body);
    });
  return deferred.promise;
}

exports.getRandomPlant = function () {
  var deferred = Q.defer();
  request(app)
    .get('/api/plant')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) return done(err);
      console.log("getRandomPlant " + res.body.data[0]._id);
      deferred.resolve(res.body.data[0]);
    });
  return deferred.promise;
}

exports.getPlant = function (plantId, toexpect) {

    //.expect(toexpect || 200)

  return  exports.httpGet('/api/plant/' + plantId,toexpect)
}

exports.getPlantFull = function (plantId, toexpect) {

 return  exports.httpGet('/api/plant/full/' + plantId)

  //  .expect(toexpect || 200)

}


exports.getRandomMarker = function () {
  var deferred = Q.defer();
  request(app)
    .get('/api/marker')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      if (err) return done(err);
      console.log("got random marker " + res.body.data[0]._id);
      deferred.resolve(res.body.data[0]);
    });
  return deferred.promise;
}

exports.seedDbLoginAndGetRandomMarker = function () {
  var deferred = Q.defer();
  exports.seedDb().then(function (t) {
    exports.getRandomMarker().then(function (m) {
      TestUserUtils.loginUser().then(function (t) {
        deferred.resolve(m);
      });
    });

  });
  return deferred.promise;
}

exports.seedPlantLoginAndGetRandomPlant = function () {
  var deferred = Q.defer();
  exports.seedPlants().then(function (t) {
    exports.getRandomPlant().then(function (m) {
      TestUserUtils.loginUser().then(function (t) {
        deferred.resolve(m);
      });
    });

  });
  return deferred.promise;
}

exports.seedPlantLoginAdminAndGetRandomPlant = function () {
  var deferred = Q.defer();
  exports.seedPlants().then(function (t) {
    exports.getRandomPlant().then(function (m) {
      TestUserUtils.loginAdmin().then(function (t) {
        deferred.resolve(m);
      });
    });

  });
  return deferred.promise;
}

exports.createPlant2 = function () {
  var deferred = Q.defer();
  TestUserUtils.loginAdmin().then(function (token) {
    exports.httpPost('/api/plant', Mocks.plants[1]).then(function (result) {
      deferred.resolve(result);
    });
  });
  return deferred.promise;
}

exports.createPlant = function () {
  var deferred = Q.defer();
  TestUserUtils.loginAdmin().then(function (token) {
    exports.httpPost('/api/plant', Mocks.plants[0]).then(function (result) {
      deferred.resolve(result);
    });
  });
  return deferred.promise;
}

exports.clearMarkers = function () {

  var deferred = Q.defer();
  return Marker.remove().exec(function () {
    console.log("clearmarkers done");
    deferred.resolve();
  });
  return deferred.promise;
}

exports.clearPlants = function () {
  var deferred = Q.defer();
  Plant.remove().exec(function () {
    console.log("clearPlants done");
    deferred.resolve();
  });
  return deferred.promise;
}
exports.createMarkerFromData = function (data) {
  console.log("createMarker");

  var deferred = Q.defer();
  TestUserUtils.loginUser().then(function (token) {
    exports.httpPost('/api/marker', data).then(function (result) {
      deferred.resolve(result);
    });

  });
  return deferred.promise;
}


exports.createMarker = function (plantid) {
  console.log("createMarker");

  var deferred = Q.defer();

  TestUserUtils.loginUser().then(function (token) {
    TestUserUtils.getCurrentUser().then(function (user) {
      exports.httpPost('/api/marker', Mocks.getMarker(plantid, user._id)).then(function (result) {
        deferred.resolve(result);
      });
    });
  });
  return deferred.promise;
}


exports.createMarker2 = function (plantid) {
  console.log("createMarker");

  var deferred = Q.defer();

  TestUserUtils.loginUser().then(function (token) {
    TestUserUtils.getCurrentUser().then(function (user) {
      exports.httpPost('/api/marker', Mocks.getMarker2(plantid, user._id)).then(function (result) {
        deferred.resolve(result);
      });
    });
  });
  return deferred.promise;
}
exports.seedPlants = function () {
  var deferred = Q.defer();
  exports.clearAllAndSeedUsers().then(function () {
    exports.createPlant().then(function (createdplant) {
      console.log('finished populating plants ', createdplant._id);
      deferred.resolve(createdplant);
    });
  }).done();
  return deferred.promise;
}

exports.seedPlantsAndLogin = function () {
  var deferred = Q.defer();
  exports.seedPlantsMultiple().then(function (plants) {
    TestUserUtils.loginUser().then(function (m) {
      deferred.resolve(plants);
    });
  });
  return deferred.promise;
}

exports.seedPlantsMultiple = function () {
  var deferred = Q.defer();
  exports.clearAllAndSeedUsers().then(function () {
    return exports.createPlant().then(function (createdplant1) {
      return exports.createPlant2().then(function (createdplant2) {
        console.log('finished populating plants ' + createdplant1._id + " " + createdplant2._id);
        deferred.resolve([createdplant1, createdplant2]);
      });
    });
  }).done();
  return deferred.promise;
}


exports.seedDb = function () {
  var deferred = Q.defer();
  exports.seedPlants().then(function (createdplant) {
    //console.log("here");
    return exports.createMarker(createdplant._id).then(function (marker) {
      deferred.resolve(marker);
    });

  }).done();
  return deferred.promise;
}

exports.seedDbForSearch = function () {
  var deferred = Q.defer();
  exports.seedPlantsMultiple().then(function (createdplants) {
    return exports.createMarker(createdplants[0]._id).then(function (marker1) {
      return exports.createMarker2(createdplants[1]._id).then(function (marker2) {
        deferred.resolve([marker1, marker2]);
      });
    });
  });
  return deferred.promise;
}

exports.clearAll = function () {
  var deferred = Q.defer();
  exports.clearPlants().then(function (createdplant) {
    exports.clearMarkers().then(function () {
      TestUserUtils.clearUsers().then(function () {
        deferred.resolve(null);
      });

    });

  });
  return deferred.promise;
}


exports.clearAllAndSeedUsers = function () {
  var deferred = Q.defer();
  exports.clearAll().then(function () {
    return TestUserUtils.createAdmin().then(function () {
      return TestUserUtils.createUser().then(function () {
        deferred.resolve(null);
      });
    });
  }).done();

  return deferred.promise;
}

exports.getToken = function () {
  return TestUserUtils.getToken();
}
