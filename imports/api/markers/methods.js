import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import _ from 'underscore';
import AuxFunctions from '../aux-functions.js';
import Markers from './namespace.js';
import './api.js'; // Markers.api
import './server/api.js'; // Markers.api
import './collection.js'; // Markers.collection
import Users from '../users/namespace.js';
import '../users/api.js'; // Users.api

//------------------------------------------------------------------------------
Meteor.methods({ 'Markers.methods.createMarker'(newMarker) {
  // Check arguments
  try {
    check(newMarker, {
      sport: String,
      title: String,
      description: String,
      date: Match.OneOf(Date, null),
      time: Match.OneOf(Date, null),
      address: String,
      selectedLocation: {
        placeId: String,
        description: String,
        center: Object,
      },
      maxParticipants: Match.OneOf(Number, null),
      cost: String,
    });
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  // Meteor._sleepForMs(3000);
  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at Markers.methods.createMarker');
  }

  const errors = Markers.api.checkNewMarkerFields(newMarker);
  if (AuxFunctions.hasErrors(errors)) {
    throw new Meteor.Error(400, AuxFunctions.getFirstError(errors).value);
  }

  // New marker object needs some clean up / re-format:
  const { selectedLocation } = newMarker;
  const { placeId, description, center } = selectedLocation;
  const newMarkerCleaned = _.omit(newMarker, 'location', 'selectedLocation');

  // Extend doc by adding back markerLocation field + createdBy and createdAt
  // fields. Plus, the user who creates an marker should have to join by default
  _.extend(newMarkerCleaned, {
    location: {
      placeId,
      description,
      geometry: {
        coordinates: [center.lng, center.lat], // reverse order!
      },
    },
    createdBy: curUserId,
    createdAt: new Date(),
    followers: [curUserId],
    /* participants: [{
      userId: curUserId,
      joinedAt: new Date(),
    }], */
  });

  // Insert document into DB
  const markerId = Markers.collection.insert(newMarkerCleaned);

  // Result
  return markerId;
} });
//------------------------------------------------------------------------------
Meteor.methods({ 'Markers.methods.joinUnjoin'(markerId) {
  // Check arguments
  try {
    check(markerId, String);
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at Markers.methods.joinUnjoin');
  }

  // const errors = Markers.api.checkNewMarkerFields(newMarker);
  // if (AuxFunctions.hasErrors(errors)) {
  //  throw new Meteor.Error(400, AuxFunctions.getFirstError(errors).value);
  // }

  // Is the current user already in the list of participants? ...
  const marker = Markers.collection.findOne({ _id: markerId });
  const curUserIsInParticipantsList = _.indexOf(_.pluck(marker.participants, 'userId'), curUserId) !== -1;

  // TODO: if activity is full or finished, reject action

  // ... if yes, remove it from the marker ...
  const unJoin = {
    $pull: {
      participants: {
        userId: curUserId,
      },
    },
  };
  // ... Otherwise, add it.
  const join = {
    $push: {
      participants: {
        userId: curUserId,
        joinedAt: new Date(),
      },
    },
  };
  const modifier = curUserIsInParticipantsList ? unJoin : join;

  // Update document
  Markers.collection.update({ _id: markerId }, modifier);

  // Run server side only
  /* if (!this.isSimulation) {
    // Don't wait for the following task to be done before giving the client
    // the green light to move ahead
    Meteor.defer(() => {
      Markers.api.setStatusToFullIfNecessary(markerId);
    });
  } */
} });
//------------------------------------------------------------------------------
Meteor.methods({ 'Markers.methods.updateMarker'(markerId, marker) {
  // Check arguments
  try {
    check(markerId, String);
    check(marker, {
      // sport: String,
      title: String,
      date: Match.OneOf(Date, null),
      time: Match.OneOf(Date, null),
      address: String,
      location: {
        placeId: String,
        description: String,
        center: Object,
      },
      description: String,
      maxParticipants: Match.OneOf(Number, null),
      cost: String,
    });
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  // Meteor._sleepForMs(3000);
  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at Markers.methods.updateMarker');
  }

  const errors = Markers.api.checkUpdateMarkerFields(marker);
  if (AuxFunctions.hasErrors(errors)) {
    throw new Meteor.Error(400, AuxFunctions.getFirstError(errors).value);
  }

  // Marker object needs some clean up / re-format:
  const {
    title,
    date,
    time,
    location,
    description,
    maxParticipants,
    cost,
  } = marker;

  // const { placeId, description, center } = location;
  // const markerCleaned = _.omit(marker, 'location');

  // Extend doc by adding back markerLocation field + createdBy and createdAt
  // fields. Plus, the user who creates an marker should have to join by default
  // _.extend(markerCleaned, {
  const modifier = {
    $set: {
      title,
      date,
      time,
      description,
      maxParticipants,
      cost,
      location: {
        placeId: location.placeId,
        description: location.description,
        geometry: {
          type: 'Point',
          coordinates: [location.center.lng, location.center.lat], // reverse order!
        },
      },
    },
  };

  // Update document
  Markers.collection.update({ _id: markerId }, modifier);
} });
//------------------------------------------------------------------------------
