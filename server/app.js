/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var cluster = require('cluster');
var numNodes;
var schedulerId;
if (process.argv[2]) {
  numNodes = 1;
} else {
  numNodes = 2;
}

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

if (process.env.NODE_ENV == 'unittest') {
  if(config.seedDB) { require('./config/seed'); }
  require('./config/refdataseed');
  initLocalServer();

}else{
  mongoose.connection.on('connected', function () {
    if(config.seedDB) { require('./config/seed'); }

    require('./config/refdataseed');

    if (cluster.isMaster && process.env.NODE_ENV != 'unittest') {
      initCluster();
    } else {
      initLocalServer();
    }
  });
}



cluster.on('listening', function (worker, address) {
  console.log('Process ' + worker.process.pid + ' for express server listening on %d', address.port);
});

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:'+err.message,err);
  console.error(err.stack);
  console.error(err);
  process.exit(1);
})


function initLocalServer(){

  var app = express();
  var server = require('http').createServer(app);
  require('./config/express')(app);
  require('./routes')(app);

  // Start server
  server.listen(config.port, config.ip, function () {
    // console.log('Started a %s mode worker', app.get('env'));
  });

  module.exports = app;
  if (process.env.jobs) {
    if (config.runJobs &&process.env.NODE_ENV != 'unittest') {
      console.log('Process %d is running scheduled jobs', cluster.worker.process.pid);
      require('./instagramimport/importer.job')
      require('./instagramimport/userrefresh/userrefresher.job')
    } else {
      console.warn("Process %d was asked to run scheduled jobs, but it is off in the config and therefore not running them", cluster.worker.process.pid);
    }
  }

}

function initCluster(){
  // Fork off the worker threads. The first one will be also run the imported jobs
  // Need to confirm when the first worker is restarted because of an
  // uncaught exception that it is handed the same env params again.

  var debug = process.execArgv.indexOf('--debug') !== -1;
  cluster.setupMaster({
    execArgv: process.execArgv.filter(function (s) {
      return s !== '--debug'
    })
  });
  for (var i = 0; i < numNodes; i++) {
    if (i == 0 && (!(process.argv[2]) || process.argv[2] == "worker")) {
      if (debug) cluster.settings.execArgv.push('--debug=' + (5859 + i));
      var worker = cluster.fork({jobs: true});
      if (debug) cluster.settings.execArgv.pop();
      schedulerId = worker.process.pid;
    } else {
      cluster.fork();
    }
  }
  cluster.on('exit', function (worker) {
    var debug = process.execArgv.indexOf('--debug') !== -1;
    cluster.setupMaster({
      execArgv: process.execArgv.filter(function (s) {
        return s !== '--debug'
      })
    });
    if (debug) cluster.settings.execArgv.push('--debug=' + (5859 + worker.id));
    if (worker.process.pid == schedulerId) {
      console.log("Process %s has died, and it was a scheduler node. Restarting this as a scheduler node..", worker.process.pid);
      var newWorker = cluster.fork({jobs: true});
      schedulerId = newWorker.process.pid;
      if (debug) cluster.settings.execArgv.pop();
    } else {
      console.log('Process %s has died. Restarting', worker.process.pid);
      cluster.fork();
      if (debug) cluster.settings.execArgv.pop();
    }
  });
}


