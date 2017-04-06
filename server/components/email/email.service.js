'use strict';

var _ = require('lodash');
var nodemailer = require('nodemailer');


exports.sendEmailTo = function (to, data) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'playlearn.mobi@gmail.com',
            pass: 'l2nGuages1970ghj4765'
        }
    });

    data.to = to;

    if (data.from == null) {
        data.from = 'feedback@wildfood.me';
    }

    console.log("EMAIL SEND to " + data.to);
    transporter.sendMail(data, function (error, info) {
        if (error) {
            console.log("ERROR WITH EMAIL", error);
        } else {
            console.log('Message sent SUCCESS: ' + info.response);
        }
    });
}
