'use strict';

var _ = require('lodash');
var Q = require("q");

//http://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js
//https://github.com/edwardhotchkiss/mongoose-paginate

exports.getSkip = function (req) {

  var value = 0;
  if (req.query.page && req.query.size) {
    value = (parseInt(req.query.page) - 1) * parseInt(req.query.size);
  }

  return value;
}

exports.getLimit = function (req) {

  var value = 100000000;
  if (req.query.page && req.query.size) {
    value = parseInt(req.query.size);
  }
  return value;
}

exports.populatePagedResults = function (list, req, count) {
  var pagination = {
    itemCount: count || list.length
  }

  if (req.query.page) {
    pagination.page = req.query.page;
    pagination.size = req.query.size;

    if (list.length < pagination.size  || list.length == 0) {
      pagination.next_page = -1;


    } else {
      pagination.next_page = parseInt(pagination.page) + 1;
    }

  }

  return {
    data: list,
    pagination: pagination
  };
}
