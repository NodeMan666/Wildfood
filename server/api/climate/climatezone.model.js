'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClimatezoneSchema = new Schema({
    bomcode: Number,
    koppenCode: String,
    usdaCode: String,
    hardiness_zone: String,
    name: String,
    category: String,
    description: String,
    color: String,
    samplePlaces: [
        {
            country: String,
            town: String,
            position: []
        }
    ],
    active: Boolean
});

module.exports = mongoose.model('Climatezone', ClimatezoneSchema);







