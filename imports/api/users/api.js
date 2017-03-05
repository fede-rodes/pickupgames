import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import _ from 'underscore';
import { check, Match } from 'meteor/check';
// import { Roles } from 'meteor/alanning:roles';
import Users from './namespace.js';
import './collection.js'; // Users.collection
import { AuxFunctions } from '../aux-functions.js';

//------------------------------------------------------------------------------
/**
* @summary Handle errors from signup facebook callback.
*/
// TODO: adapt the following code for facebook auth
/* Users.api.updateSearchValue = (searchType, newLocation, radius, mapBounds) => {
  check(searchType, Match.OneOf(['input', 'map']));
  check(newLocation, Match.Optional({
    placeId: String,
    description: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  }));
  check(radius, Match.Optional(Number));
  check(mapBounds, Match.Optional({
    southWest: {
      lat: Number,
      lng: Number,
    },
    northEast: {
      lat: Number,
      lng: Number,
    },
  }));

  const curUser = Meteor.user();

  if (!curUser) {
    return;
  }

  // If search value isn't set for the current user we'll always update

  // let update = true;

  // Only update search value if the new value is different from the value
  // stored in the DB.
  /// if (curUser.searchValue) {
    const { input, map } = curUser.searchValue;

    if (searchType === 'input') {
      if (!!input && input.placeId === newLocation.placeId && input.radius === radius) {
        // Nothing changed, do not update user search value
        return;
      }
    } else if (searchType === 'map') {
      if (!!map && map.bounds)

    } else {
      throw new Error('wrong searchType at Users.api.updateSearchValue');
    }
  } ///

  console.log('update user search value');
  const params = Object.assign({}, selectedLocation, { radius });
  // TODO: use defer or similar...
  Meteor.call('Users.methods.updateSearchValue', params, (err) => {
    if (err) {
      console.log(err);
    }
  });
}; */
//------------------------------------------------------------------------------
/**
* @summary Handle errors from signup facebook callback.
*/
// TODO: adapt the following code for facebook auth
Users.api.handleSignupErrors = (err) => {
  // check(err, Object);

  const { error, reason } = err;

  // Initialize errors
  const errors = {
    username: [],
    email: [],
    password: [],
  };

  // Handle known errors firts
  if (error === 403) {
    if (reason === 'Username already exists.') {
      // XXX i18n
      errors.username.push('Username already exists');
    } else if (reason === 'Email already exists.') {
      // XXX i18n
      errors.email.push('Email already exists');
    }
  // Handle unexpected error
  } else {
    // XXX i18n
    errors.username.push('Unexpected error');
    errors.email.push('Unexpected error');
    errors.password.push('Unexpected error');
    // errors.password2.push('Unexpected error');
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Handle errors from facebook login callback.
*/
// TODO: adapt the following code for facebook auth
Users.api.handleLoginErrors = (err) => {
  // check(err, Object);
  const { error, reason } = err;

  // Initialize errors
  const errors = {
    email: [],
    password: [],
  };

  // Handle known errors firts
  if (error === 403) {
    if (reason === 'Incorrect password') {
      // XXX i18n
      errors.password.push(reason);
    } else if (reason === 'User not found') {
      // XXX i18n
      errors.email.push(reason);
    }
  // Handle unexpected error
  } else {
    // XXX i18n
    errors.password.push('Unexpected error');
    errors.email.push('Unexpected error');
  }

  return errors;
};
//------------------------------------------------------------------------------
Users.api.formatUser = (user) => {
  // Copy user
  const formattedUser = { ...user };

  const { searchValue } = formattedUser;
  if (!searchValue) {
    return formattedUser;
  }

  let newPlace = {};
  let newMap = {};

  // Override place lngLat
  if (searchValue.place && searchValue.place.center) {
    const { place } = searchValue;
    const { placeId, description, center, radius } = place;
    const { lngLat } = center;
    newPlace = {
      placeId,
      description,
      center: {
        lat: lngLat[1],
        lng: lngLat[0],
      },
      radius,
    };
  }

  // Override map lngLat
  if (searchValue.map && searchValue.map.bounds) {
    const { map } = searchValue;
    const { bounds, center, zoom } = map;
    const { southWest, northEast } = bounds;
    newMap = {
      southWest: {
        lat: southWest.lngLat[1],
        lng: southWest.lngLat[0],
      },
      northEast: {
        lat: northEast.lngLat[1],
        lng: northEast.lngLat[0],
      },
      center: {
        lat: center.lngLat[1],
        lng: center.lngLat[0],
      },
      zoom,
    };
  }

  // Override searchValue field, getting rid of lngLat
  _.extend(formattedUser, {
    searchValue: {
      place: newPlace,
      map: newMap,
    },
  });

  return formattedUser;
};
