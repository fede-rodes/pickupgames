import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import _ from 'underscore';
import GoogleMaps from '../namespace.js';
import './api.js'; // GoogleMaps.api

//------------------------------------------------------------------------------
/**
* @summary Use google maps API to fetch matches based on the given address.
* @param {string} address - Address
*/
Meteor.methods({ 'GoogleMaps.methods.getAutocompleteOptions'(address) {
  check(address, String);

  // Allow other methods to run before this one is completed
  this.unblock();

  // Return options
  return GoogleMaps.api.autocomplete(address);
} });
//------------------------------------------------------------------------------
/**
* @summary Use google maps API to fetch location { lat, lng } based placeId.
* @param {string} placeId - Google maps placeId
*/
Meteor.methods({ 'GoogleMaps.methods.getPlaceIdLocation'(placeId) {
  check(placeId, String);

  // Allow other methods to run before this one is completed
  this.unblock();

  // Return location = { lat, lng }
  return GoogleMaps.api.placeDetails(placeId);
} });
