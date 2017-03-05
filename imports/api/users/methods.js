import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import _ from 'underscore';
// import AuxFunctions from '../aux-functions.js';
// import { Users } from './namespace.js';
// import './api.js'; // Users.api

//------------------------------------------------------------------------------
Meteor.methods({ 'Users.methods.attachMarkerToUser'(markerId, actionType) {
  // Check arguments
  try {
    check(markerId, String);
    check(actionType, Match.OneOf('new', 'join-unjoin', 'like-unlike'));
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at Users.methods.attachMarkerToUser');
  }

  // TODO: Check marker existance?

  // Set modifier based on actionType and user data
  const curUser = Meteor.users.findOne({ _id: curUserId });
  let modifier = {};
  switch (actionType) {
    case 'new':
      modifier = {
        $addToSet: {
          createdMarkers: markerId,
          // joinedMarkers: markerId,
        },
      };
      break;
    case 'join-unjoin': {
      // Is the marker already in the user doc? If so, unjoin, otherwise join.
      const joinedAlready = _.find(curUser.joinedMarkers, (joinedMarkerId) =>
        (joinedMarkerId === markerId)
      );
      modifier = {
        [joinedAlready ? '$pull' : '$addToSet']: {
          joinedMarkers: markerId,
        },
      };
      break;
    }
    default:
      throw new Error('wrong value at Users.methods.attachMarkerToUser');
  }

  // Update user doc
  Meteor.users.update({ _id: curUserId }, modifier);
} });
//------------------------------------------------------------------------------
