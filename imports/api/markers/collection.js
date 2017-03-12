import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Constants from '../constants.js';
import Markers from './namespace.js';

// =============================================================================
// COLLECTION:
// =============================================================================
Markers.collection = new Mongo.Collection('Markers');

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
Markers.collection.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Markers.collection.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// =============================================================================
// SCHEMA(S):
// =============================================================================
// SEE: http://themeteorchef.com/snippets/using-the-collection2-package/
//------------------------------------------------------------------------------
Markers.collection.attachSchema(new SimpleSchema({

  //----------------------------------------------------------------------------
  // Mandatory fields
  //----------------------------------------------------------------------------

  createdBy: {
    type: String,
    label: 'Id of the user who created the activity',
    denyUpdate: true,
  },

  createdAt: {
    type: Date,
    label: 'Activity creation\'s date',
    denyUpdate: true,
  },

  sport: {
    type: String,
    label: 'Sport type: football, tennis, ...',
    allowedValues: Constants.MARKER_SPORTS_ARRAY,
  },

  title: {
    type: String,
    label: 'Brief description about the activity',
    max: Constants.MARKER_TITLE_MAX_LENGTH,
  },

  date: {
    type: Date,
    label: 'Date of the activity',
    // TODO: reject if date <= yesterday
  },

  time: {
    type: Date,
    label: 'Starting time for the activity',
    // regEx: /^[0-9:]{5}$/,
  },

  location: {
    type: Object,
  },

  'location.placeId': {
    type: String,
    label: 'PlaceId returned by the google maps autocomplete API',
  },

  'location.description': {
    type: String,
    label: 'Address (street name, number, city, ...) returned by the google maps autocomplete API',
  },

  'location.geometry': {
    type: Object,
    label: 'Coordinates in geoJSON format',
    index: '2dsphere',
  },

  'location.geometry.type': {
    type: String,
    label: 'geoJSON type',
    allowedValues: ['Point'],
    autoValue() {
      if (this.isInsert) {
        return 'Point';
      }
      return this.unset();
    },
    denyUpdate: true,
  },

  'location.geometry.coordinates': {
    type: [Number],
    label: '[lng, lat]',
    decimal: true,
    minCount: 2,
    maxCount: 2,
    custom() {
      if (this.value[0] < -180 || this.value[0] > 180) {
        return 'lngOutOfRange';
      } else if (this.value[1] < -85 || this.value[1] > 85) {
        return 'latOutOfRange';
      }
      return true;
    },
  },

  participants: {
    type: [Object],
    label: 'List of participants for the activity',
    defaultValue: [],
  },

  'participants.$.userId': {
    type: String,
  },

  'participants.$.joinedAt': {
    type: Date,
  },

  status: {
    type: String,
    allowedValues: ['active', 'canceled', 'finished'],
    defaultValue: 'active',
  },

  repeat: {
    type: Boolean,
    label: 'Whether or not to repeat the activity every week',
    defaultValue: false,
  },

  admins: {
    type: [String],
    label: 'List of user ids with admin access to the activity',
    minCount: 0,
    maxCount: 5,
    defaultValue: [],
  },

  followers: {
    type: [String],
    label: 'List of user ids following the activity',
    defaultValue: [],
  },

  //----------------------------------------------------------------------------
  // Optional fields
  //----------------------------------------------------------------------------

  description: {
    type: String,
    max: Constants.MARKER_DESCRIPTION_MAX_LENGTH,
    label: 'Full description about the activity / relevant observations',
    optional: true,
  },

  maxParticipants: {
    type: Number,
    label: 'Maximum number of participants for the activity',
    min: 2,
    optional: true,
  },

  cost: {
    type: String,
    label: 'Cost per person',
    max: Constants.MARKER_COST_MAX_LENGTH,
    optional: true,
  },

  /* fieldType: {
    type: String,
    label: 'Brief description of the field where the activity is going to take place: surface type, dimension, whatever relevant',
    max: Constants.MARKER_FIELD_TYPE_MAX_LENGTH,
    optional: true,
  },

  duration: {
    type: String,
    label: 'Duration of the activity',
    max: Constants.MARKER_DURATION_MAX_LENGTH,
    optional: true,
  },

  venueId: {
    type: String,
    label: 'Id of the venue where the activity is going to take place',
    optional: true,
  }, */

}));
