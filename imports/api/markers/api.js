import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { indexOf } from 'lodash';
import Constants from '../constants.js';
import AuxFunctions from '../aux-functions.js';
import Markers from './namespace.js';

//------------------------------------------------------------------------------
/**
* @summary Verify new marker fields before inserting doc into database.
*/
Markers.api.checkNewMarkerFields = (newMarker) => {
  // Check arguments
  try {
    check(newMarker, {
      sport: String,
      venueId: String,
      date: Match.OneOf(Date, null),
      time: Match.OneOf(Date, null),
    });
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  // Destructure
  const { sport, venueId, date, time } = newMarker;

  // Initialize errors
  const errors = {
    sport: [],
    venueId: [],
    date: [],
    time: [],
  };

  // Checks
  if (!sport || sport.trim().length === 0) {
    errors.sport.push('This field is required');
  } else if (indexOf(Constants.MARKER_SPORTS_ARRAY, sport) === -1) {
    errors.sport.push('Unknown sport');
  }

  if (!venueId || venueId.trim().length === 0) {
    errors.venueId.push('This field is required');
  }

  if (!date) {
    errors.date.push('This field is required');
  } else if (date < AuxFunctions.getStartCurDate()) {
    errors.date.push('Invalid date');
  }

  if (!time) {
    errors.time.push('This field is required');
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Verify marker fields before updating database.
*/
Markers.api.checkUpdateMarkerFields = (marker) => {
  console.log(marker);

  // Check arguments
  try {
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

  // Destructure
  const {
    // sport,
    title,
    description,
    date,
    time,
    address,
    location,
    maxParticipants,
    cost,
  } = marker;

  // Initialize errors
  const errors = {
    sport: [],
    title: [],
    description: [],
    date: [],
    time: [],
    address: [],
    location: [],
    maxParticipants: [],
    cost: [],
  };

  // Checks
  /* if (!sport || sport.trim().length === 0) {
    errors.sport.push('This field is required');
  } else if (_.indexOf(Constants.MARKER_SPORTS_ARRAY, sport) === -1) {
    errors.sport.push('Unknown sport');
  } */

  if (!title || title.trim().length === 0) {
    errors.title.push('This field is required');
  } else if (title.trim().length > Constants.MARKER_TITLE_MAX_LENGTH) {
    errors.title.push(`Title is too long, max ${Constants.MARKER_TITLE_MAX_LENGTH} characters`);
  }

  if (description && description.trim().length > Constants.MARKER_DESCRIPTION_MAX_LENGTH) {
    errors.description.push(`Description is too long, max ${Constants.MARKER_DESCRIPTION_MAX_LENGTH} characters`);
  }

  if (!date) {
    errors.date.push('This field is required');
  } else if (date < AuxFunctions.getStartCurDate()) {
    errors.date.push('Invalid date');
  }

  if (!time) {
    errors.time.push('This field is required');
  }

  if (!address) {
    errors.address.push('This field is required');
  } else if (!location || AuxFunctions.optionIsEmpty(location)) {
    errors.address.push('Please choose one of the options from the dropdown');
  }

  /* if (!maxParticipants) {
    errors.maxParticipants.push('This field is required');
  } */

  if (cost && cost.trim().length > Constants.MARKER_COST_MAX_LENGTH) {
    errors.cost.push(`Cost is too long, max ${Constants.MARKER_COST_MAX_LENGTH} characters`);
  }

  return errors;
};
//------------------------------------------------------------------------------
