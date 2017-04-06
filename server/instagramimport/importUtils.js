var moment = require('moment');
var GeoCoding = require('./../api/location/geocoding.service.js');
var Q = require("q");

exports.convertDate = function (instagramDate) {

    var date = new Date(parseInt(instagramDate) * 1000);
    console.log("converting date " + instagramDate + " to ", date);
    return date;
}

exports.convertImage = function (image) {
    var returnimage = {
        credit: image.image_credit,
        credit_link: image.image_credit_link,
        versions: {}
    }
    returnimage.versions.thumb = image.thumbnail;
    returnimage.versions.low = image.low_resolution;
    returnimage.versions.standard = image.standard_resolution;
    return returnimage;
}




exports.cleanText = function (text) {
    if (!text || text == "") {
        return null;
    }

    text = text.replace(/\r/g, '');
    text = text.replace(/\n/g, '');
    return text;

    //"Extended use of this plant, either medicinally or in the diet, can cause \r\nallergic skin rashes or lead" +
    //" to photosensitivity in some people. Theoretically yarrow can enhance the sedative effects of" +
    //" other \r\nherbs (e.g. valerian, kava, German chamomile, hops) & sedative \r\ndrugs. " +
    //"Possible sedative & diuretic effects from ingesting large \r\namounts.",

}


exports.processLocation = function (marker) {
    console.log("processLocation");
    var deferred = Q.defer();
    if (marker.location.name && marker.location.name.length > 0) {
        GeoCoding.reverseGeoCode([marker.location.longitude, marker.location.latitude]).then(function (results) {

            if (results.formatted_long != 'Unknown location') {
                var res = results;
                //res.locality.short_name = marker.location.name;
                res.locality.long_name = marker.location.name;
                res.locality.short_name = marker.location.name;
                res.formatted_long = (res.locality.long_name || '')
                    + ", " + (results.state.long_name || '') + ", " + (results.country.long_name || '');

                res.formatted_short = (res.locality.short_name || '') + " " +
                    (res.state.short_name || '') + " " + ( res.country.short_name || ''),

                    deferred.resolve(res);
            } else {
                deferred.resolve(null);
            }
        });

    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
}
