import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Constants from '../constants.js';

// =============================================================================
// COLLECTION:
// =============================================================================
// Meteor.users = new Mongo.Collection('users');

// =============================================================================
// ALLOW & DENY RULES:
// =============================================================================
/*
SOURCE: https://themeteorchef.com/recipes/building-a-user-admin/
To save face, we can “lock down” all of our rules when we define our collection
to prevent any client-side database operations from taking place. This means
that when we interact with the database, we’re required to do it from the server
(a trusted environment) via methods.
SOURCE: http://docs.meteor.com/#/full/deny
When a client tries to write to a collection, the Meteor server first checks the
collection's deny rules. If none of them return true then it checks the
collection's allow rules. Meteor allows the write only if no deny rules return
true and at least one allow rule returns true.
*/
Meteor.users.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Meteor.users.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// =============================================================================
// SCHEMA(S):
// =============================================================================
// SEE: http://themeteorchef.com/snippets/using-the-collection2-package/
const lngLatSchema = new SimpleSchema({

  lngLat: {
    type: [Number],
    label: '[lng, lat]',
    decimal: true,
    minCount: 2,
    maxCount: 2,
    autoValue() {
      if (this.isSet) {
        //console.log("this.value: ", this.value);
        if (this.value[0] < -180 || this.value[0] > 180) { // lng
          return 'lngOutOfRange';
        } else if (this.value[1] < -85 || this.value[1] > 85) { // lat
          return 'latOutOfRange';
        }
        return this.value;
      }
      return this.unset();
    },
  },

});
//------------------------------------------------------------------------------
Meteor.users.attachSchema(new SimpleSchema({

  createdAt: {
    type: Date,
  },

  profile: {
    type: Object,
  },

  'profile.name': {
    type: String,
    max: 150,
  },

  'profile.gender': {
    type: String,
    max: 150,
    optional: true,
  },

  avatar: {
    type: String,
    label: 'User\'s avatar from facebook or any orther social network',
  },

  emails: {
    type: [Object],
    // this must be optional if you also use other login services like facebook,
    // but if you use only accounts-password, then it can be required
    optional: true,
  },

  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },

  'emails.$.verified': {
    type: Boolean,
  },

  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },

  createdMarkers: {
    type: [String],
    defaultValue: [],
  },

  joinedMarkers: {
    type: [String],
    defaultValue: [],
  },

  // Search value
  searchValue: {
    type: Object,
    label: 'Default user search value',
    // optional: true,
    defaultValue: {},
  },

  // Place
  'searchValue.place': {
    type: Object,
    optional: true,
  },

  'searchValue.place.placeId': {
    type: String,
    label: 'PlaceId returned by the google maps autocomplete API',
    // defaultValue: '',
    optional: true,
  },

  'searchValue.place.description': {
    type: String,
    label: 'Address (street name, number, city, ...) returned by the google maps autocomplete API',
    // defaultValue: '',
    optional: true,
  },

  'searchValue.place.center': {
    type: lngLatSchema,
    label: 'coordinates: [lng, lat]',
    // defaultValue: '',
    optional: true,
  },

  'searchValue.place.radius': {
    type: Number,
    // defaultValue: Constants.FEED_MAX_RADIUS,
    optional: true,
  },

  // Map
  'searchValue.map': {
    type: Object,
    optional: true,
  },

  'searchValue.map.bounds': {
    type: Object,
    label: 'southWest, northEast',
    optional: true,
  },

  'searchValue.map.bounds.southWest': {
    type: lngLatSchema,
    label: 'southWest: [lng, lat]',
    optional: true,
  },

  'searchValue.map.bounds.northEast': {
    type: lngLatSchema,
    label: 'northEast: [lng, lat]',
    optional: true,
  },

  'searchValue.map.center': {
    type: lngLatSchema,
    label: 'northEast: [lng, lat]',
    optional: true,
  },

  'searchValue.map.zoom': {
    type: Number,
    optional: true,
  },

  roles: {
    type: [String],
    optional: true,
  },

  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true,
  },

}));



  /* default: {
    type: Object,
    label: 'Default user values',
    optional: true,
    // defaultValue: {},
  },

  'default.location': {
    type: Object,
    label: 'Default feed page search value',
    // defaultValue: '',
    optional: true,
  },

  'default.location.placeId': {
    type: String,
    label: 'PlaceId returned by the google maps autocomplete API',
    // defaultValue: '',
    optional: true,
  },

  'default.location.description': {
    type: String,
    label: 'Address (street name, number, city, ...) returned by the google maps autocomplete API',
    // defaultValue: '',
    optional: true,
  },

  'default.location.radius': {
    type: Number,
    // defaultValue: Constants.FEED_MAX_RADIUS,
    optional: true,
  },

  'default.location.geometry': {
    type: Object,
    label: 'Coordinates in geoJSON format',
    index: '2dsphere',
    optional: true,
  },

  'default.location.geometry.type': {
    type: String,
    label: 'geoJSON type',
    allowedValues: ['Point'],
    optional: true,
    /// autoValue() {
      if (this.isInsert || this.isUpdate) {
        return 'Point';
      }
      return this.unset();
    }, ///
    // denyUpdate: true,
  },

  'default.location.geometry.coordinates': {
    type: [Number],
    label: '[lng, lat]',
    decimal: true,
    minCount: 2,
    maxCount: 2,
    optional: true,
    // TODO: try with optional: true and if (this.isSet())
    autoValue() {
      if (this.isSet) {
        //console.log("this.value: ", this.value);
        if (this.value[0] < -180 || this.value[0] > 180) { // lng
          return 'lngOutOfRange';
        } else if (this.value[1] < -85 || this.value[1] > 85) { // lat
          return 'latOutOfRange';
        }
        return this.value;
      }
      return this.unset();
    },
    ///
    autoValue() {
      if (this.isInsert) {
        return [0, 0];
      } else if (this.isUpdate) {
        if (this.isSet) {
          //console.log("this.value: ", this.value);
          if (this.value[0] < -180 || this.value[0] > 180) {
            return 'lngOutOfRange';
          } else if (this.value[1] < -85 || this.value[1] > 85) {
            return 'latOutOfRange';
          }
        }
        return this.unset();
      }
      return this.unset();
    },
    ///
    /// custom() {
      if (this.value[0] < -180 || this.value[0] > 180) {
        return 'lngOutOfRange';
      } else if (this.value[1] < -85 || this.value[1] > 85) {
        return 'latOutOfRange';
      }
      return true;
    }, ///
  }, */
