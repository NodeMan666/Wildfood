/**
 * Created by rhys on 15/11/2014.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = require('./../common/image.model');
var Comment = require('./../common/comment.model');

var VoteItem = {
  type: {type: Boolean, default: true},
  created: {type: Date, default: Date.now},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  userIsAdmin: {type: Boolean, default: false}
};

var VotingSet = {
  count: {type: Number, default: 0, index: true},
  items: [VoteItem]
};


var AddressItem = {
  short_name: String,
  long_name: String
};

var markerSchema = new Schema({
  plant: {type: Schema.Types.ObjectId, ref: 'Plant', index: true},
  plant_by_user: String,
  plant_unknown: Boolean,
  location: {
    position: [],
    address: {
      locality: AddressItem,
      state: AddressItem,
      country: AddressItem,
      formatted_long: String,
      formatted_short: String
    }
  },
  images: [Image.schema],
  comments: [
    {
      text: String,
      owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
      source_id: String,
      created: {type: Date, default: Date.now},
      images: [Image.schema]
    }
  ],
  legacyid: Number,
  legacyplantid: Number,
  source: String,
  source_id: {type: String, unique: true, sparse: true, dropDups: true},
  source_link: String,
  description: String,
  title: String,
  access: String, //['public','private', 'notsure']
  tags: {type: [String], index: true},
  //this should be on the plant actually
  permanencyType: String, //['permanent','stable','transient']//like for trees, weed should not be permanent
  confirmations: VotingSet,
  likes: VotingSet,
  notfoundVotes: VotingSet,
  owner: {type: Schema.Types.ObjectId, ref: 'User', required: true, index: true},
  /* visibility:         { type:Schema.Types.ObjectId, ref: 'UserCircle', index: true }, - need to work this */
  private: {type: Boolean, default: false, index: true},
  created: {type: Date, default: Date.now},
  migrated: {type: Date},
  imported: {type: Date},
  updated: {type: Date, default: Date.now},
  verified: {type: Boolean, default: false},
  active: {type: Boolean, default: true, index: true}

});

markerSchema
  .virtual('profile')
  .get(function () {
    var locality = "en_au";

    var myplant = null;
    if (this.plant != null && this.plant._id) {
      myplant = this.plant.shortprofile;
    }

    return {

      '_id': this._id,
      'position': this.position,
      'comments': this.comments,
      'location': this.location,
      'description': this.description,
      'imported': this.imported,//get rid of this after a while
      'migrated': this.migrated,//get rid of this after a while
      'created': this.created,
      'owner': this.owner,
      'access': this.access,
      'likes': this.likes,
      'images': this.images,
      'active': this.active,
      'verified': this.verified,
      'title': this.title,
      'source_id': this.source_id, //get rid of this after a while
      'source_link': this.source_link, //get rid of this after a while
      'legacyid': this.legacyid,//get rid of this after a while
      'plant_by_user': this.plant_by_user,
      'plant_unknown': this.plant_unknown,
      'plant': myplant,
      'source': this.source
    };
  });

// Validate duplicates
markerSchema
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
  }, 'This marker has already been imported (legacyid)');

markerSchema
  .path('source_id')
  .validate(function (value, respond) {
    var self = this;
    if (value != null) {
      this.constructor.findOne({source_id: value}, function (err, user) {
        if (err) throw err;
        if (user) {
          if (self.id === user.id) return respond(true);
          return respond(false);
        }
        respond(true);
      });
    } else {
      respond(true);
    }
  }, 'This marker has already been imported (source_id)');

//markerSchema.index({'location.position': '2d'});
markerSchema.index({'location.position': '2dsphere'});


module.exports = mongoose.model('Marker', markerSchema);
