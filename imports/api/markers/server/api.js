import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
// import _ from 'underscore';
// import Constants from '../constants.js';
// import AuxFunctions from '../aux-functions.js';
import Markers from '../namespace.js';
import '../collection.js'; // Markers.collection

//------------------------------------------------------------------------------
/**
* @summary Set marker status to full if necessary.
*/
/* Markers.api.setStatusToFullIfNecessary = (markerId) => {
  // Check arguments
  try {
    check(markerId, String);
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  const marker = Markers.collection.findOne({ _id: markerId });
  const { maxParticipants, participants } = marker;

  if (maxParticipants <= participants.length) {
    // Update document
    const modifier = {
      $set: {
        status: 'full',
      },
    };
    Markers.collection.update({ _id: markerId }, modifier);
  }
}; */
//------------------------------------------------------------------------------
