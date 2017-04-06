'use strict';

var _ = require('lodash');
var emailer = require('./../../components/email/email.service');
var Feedback = require('./feedback.model');

// Get list of feedbacks
exports.index = function (req, res) {
    Feedback.find(function (err, feedbacks) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, feedbacks);
    });
};


exports.show = function (req, res) {
    Feedback.findById(req.params.id, function (err, feedback) {
        if (err) {
            return handleError(res, err);
        }
        if (!feedback) {
            return res.send(404);
        }
        return res.json(feedback);
    });
};

// Creates a new feedback in the DB.
exports.create = function (req, res) {
    Feedback.create(req.body, function (err, feedback) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, feedback);
    });
};

exports.postfeedback = function (req, res) {

    Feedback.create(req.body, function (err, feedback) {
        if (err) {
            return handleError(res, err);
        }

        sendEmail(feedback);

        return res.json(201, feedback);
    });
};

function sendEmail(feedback) {
    var text = "FROM:" + feedback.name + " " + feedback.email + '-------------------------------\n' +
        feedback.text + '\n' + '\n' + feedback.deviceDetail;

    var data = {
        from: 'feedback@wildfood.me',
        subject: "Feedback - " + feedback.type + " - " + feedback.app,
        text: text
    };

    emailer.sendEmailTo('sallamankinen@hotmail.com', data);
    emailer.sendEmailTo('wildfoodmap@gmail.com', data);
}


// Updates an existing feedback in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Feedback.findById(req.params.id, function (err, feedback) {
        if (err) {
            return handleError(res, err);
        }
        if (!feedback) {
            return res.send(404);
        }
        var updated = _.merge(feedback, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, feedback);
        });
    });
};

// Deletes a feedback from the DB.
exports.destroy = function (req, res) {
    Feedback.findById(req.params.id, function (err, feedback) {
        if (err) {
            return handleError(res, err);
        }
        if (!feedback) {
            return res.send(404);
        }
        feedback.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
