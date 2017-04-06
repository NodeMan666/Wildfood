/**
 * Created by rhys on 15/11/2014.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Image = require('./../common/image.model');


var AddressItem = {
    short_name: String,
    long_name: String
};


var seasonalProfile = {
    dataProvidedInLocation: {
        position: [],
        address: {
            locality: AddressItem,
            state: AddressItem,
            country: AddressItem,
            formatted_long: String,
            formatted_short: String
        }

    },
    items: [
        {
            climate: {type: Schema.Types.ObjectId, ref: 'Climatezone', required: true},
            availability: {type: String, default: "NotExisting"}, //[Common, Rare, NotExisting]
            parts: [
                {
                    part: {
                        name: {type: String, required: true}
                    },
                    seasonalData: [
                        {
                            month: {type: Number, required: true},
                            mature: Boolean
                        }
                    ]
                }
            ]
        }
    ]
};


var edibilityProfileItem = {
    part: String,
    edible: {type: Boolean},
    notedible: {type: Boolean}
};

var edibilityProfile = {
    edible: {type: Boolean},
    notedible: {type: Boolean},
    rating: Number,
    parts: [edibilityProfileItem]
};

var AlertItem = {
    text: String,
    alerttype: String//[danger,info,warning]
    //relatedPlant: {type: Schema.Types.ObjectId, ref: 'Plant'}
};


var edibilityProfileItemLocalisedDetail = {
    part: String,
    conditionsOfUse: String,
    preparation: String,
    dosage: String,
    chineseMedicineDetail: String
};

var edibilityProfileLocalisedDetails = {
    description:String,
    parts: [edibilityProfileItemLocalisedDetail]
};

var localisedPlantsDetails = {
    commonNames: [String],
    name: String,
    origin: String,
    description: String,
    habitat: String,
    distinguishing_features: String,
    characteristics: String,
    wiki_link: String,
    warnings: [AlertItem],
    danger: [AlertItem],
    notes: [AlertItem],
    edibility: edibilityProfileLocalisedDetails,
    medicinalProfile: edibilityProfileLocalisedDetails,
    otherUses: edibilityProfileLocalisedDetails
};


var localisedProfile = {

    en_au: localisedPlantsDetails
}



var plantSchema = new Schema({
    scientificName: String,
    family: String,
    legacyid: Number,
    permanencyType: String, //['permanent','stable','transient']//like for trees, weed should not be permanent
    seasonalProfile: seasonalProfile,
    images: [Image.schema],
    edibility: edibilityProfile,
    medicinalProfile: edibilityProfile,
    otherUses: edibilityProfile,
    localisedProfile : localisedProfile,
    markers: [
//    {
//      marker: {type: Schema.Types.ObjectId, ref: 'Marker'},
//      location:[],
//      date: Date
//    }
        {type: Schema.Types.ObjectId, ref: 'Marker'}
    ],
    marker_count: Number,
    ala_link: String,
    wiki_link: String,
    created: {type: Date, default: Date.now},
    created_by: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    updated: {type: Date, default: Date.now},
    updated_by: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    active: {type: Boolean, default: true, index: true}
});
//     res.json(user.profile);

plantSchema
  .virtual('shortprofile')
  .get(function () {
    var locality = "en_au";

    var locProf = this.localisedProfile[locality] || {};
    return {
      'commonNames': locProf.commonNames,
      'scientificName': this.scientificName,
      '_id': this._id,
      'marker_count': this.marker_count
    };
  });

plantSchema.virtual('local_tags').get(function() {
  return this._local_tags;
});

plantSchema.virtual('local_tags').set(function(local_tags) {
  return this._local_tags = local_tags;
});

plantSchema
    .virtual('profile')
    .get(function () {
        var locality = "en_au";

        var locProf = this.localisedProfile[locality] || {};
        return {
            'commonNames': locProf.commonNames,
            'origin': locProf.origin,
            'description': locProf.description,
            'habitat': locProf.habitat,
            'distinguishing_features': locProf.distinguishing_features,
            'characteristics': locProf.characteristics,
            'wiki_link_localised': locProf.wiki_link,
            'warnings': locProf.warnings,
            'danger': locProf.danger,
            'notes': locProf.notes,
            'edibility_localised': locProf.edibility,
            'medicinalProfile_localised': locProf.medicinalProfile,
            'otherUses_localised': locProf.otherUses,
            //non localised stuff
            '_id': this._id,
            'scientificName': this.scientificName,
            'seasonalProfile': this.seasonalProfile,
            'edibility': this.edibility,
            'medicinalProfile': this.medicinalProfile,
            'otherUses': this.otherUses,
            'family': this.family,
            'images': this.images,
            'ala_link': this.ala_link,
            'wiki_link': this.wiki_link,
            'marker_count': this.marker_count
        };
    });


// Validate duplicate
plantSchema
    .path('legacyid')
    .validate(function (value, respond) {
        var self = this;
        this.constructor.findOne({legacyid: value}, function (err, user) {
            if (err) throw err;
            if (user) {
                if (self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'This plant has already been imported (legacyid)');

module.exports = mongoose.model('Plant', plantSchema);
