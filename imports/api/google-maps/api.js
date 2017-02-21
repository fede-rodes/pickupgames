import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import _ from 'underscore';
import GoogleMaps from './namespace.js';
import Constants from '../constants.js';

let map;
const markers = [];
// let mapBounds = {};

//------------------------------------------------------------------------------
/**
* @summary Initialize google map.
* @param {string} canvasId - Map container
* @see {@link https://developers.google.com/maps/documentation/javascript/adding-a-google-map}
* @see {@link https://developers.google.com/maps/documentation/javascript/interaction}
*/
GoogleMaps.api.init = (canvasId, center, zoom) => {
  check(canvasId, String);
  check(zoom, Number);

  // Initialize map
  /* const center = {
    lat: Constants.USER_DEFAULT_LAT,
    lng: Constants.USER_DEFAULT_LNG,
  }; */
  const { lat, lng } = center;
  /* console.log(`GoogleMaps.api.init.center.lat: ${center.lat}`);
  console.log(`GoogleMaps.api.init.center.lng: ${center.lng}`);
  console.log(`GoogleMaps.api.init.zoom: ${zoom}`); */
  const options = {
    center: new google.maps.LatLng(lat, lng),
    zoom,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
    },
    gestureHandling: 'cooperative',
  };
  map = new google.maps.Map(document.getElementById(canvasId), options);

  google.maps.event.addListener(map, 'bounds_changed', function() {
    const bounds = map.getBounds();
    /* console.log('--- Bounds Changed ---');
    console.log(`bounds.southWest.lat: ${bounds.getSouthWest().lat()}`);
    console.log(`bounds.southWest.lng: ${bounds.getSouthWest().lng()}`);
    console.log(`bounds.northEast.lat: ${bounds.getNorthEast().lat()}`);
    console.log(`bounds.northEast.lng: ${bounds.getNorthEast().lng()}`);
    console.log(map.getZoom());
    console.log('--- End ---'); */
  });
};
//------------------------------------------------------------------------------
/**
* @summary Initialize google map.
* @param {string} canvasId - Map container
* @see {@link https://developers.google.com/maps/documentation/javascript/adding-a-google-map}
* @see {@link https://developers.google.com/maps/documentation/javascript/interaction}
*/
GoogleMaps.api.addEventListenerIdle = (callback) => {
  google.maps.event.addDomListener(map, 'idle', function() {
    const bounds = map.getBounds();
    const center = map.getCenter();
    callback({
      southWest: {
        lat: bounds.getSouthWest().lat(),
        lng: bounds.getSouthWest().lng(),
      },
      northEast: {
        lat: bounds.getNorthEast().lat(),
        lng: bounds.getNorthEast().lng(),
      },
      center: {
        lat: center.lat(),
        lng: center.lng(),
      },
      zoom: map.getZoom(),
    });
  });
};
//------------------------------------------------------------------------------
/**
* @summary Remove mapbox.
* @see {@link https://www.mapbox.com/mapbox-gl-js/api/}
*/
/* GoogleMaps.api.end = function () {
  map.remove();
}; */
//------------------------------------------------------------------------------
/**
* @summary Set map center.
* @param {object} center - New center { lat, lng }.
*/
GoogleMaps.api.setCenter = (center) => {
  check(center, {
    lat: Number,
    lng: Number,
  });

  // Re-center map
  const { lat, lng } = center;
  const newCenter = new google.maps.LatLng(lat, lng);
  map.setCenter(newCenter);
};
//------------------------------------------------------------------------------
/**
* @summary Set map bounds.
* @param {object} mapBounds - SouthWest, NorthEast.
*/
GoogleMaps.api.setBounds = (mapBounds) => {
  check(mapBounds, {
    southWest: {
      lat: Number,
      lng: Number,
    },
    northEast: {
      lat: Number,
      lng: Number,
    },
  });

  const { southWest, northEast } = mapBounds;
  const southWestLatLng = new google.maps.LatLng(southWest.lat, southWest.lng);
  const northEastLatLng = new google.maps.LatLng(northEast.lat, northEast.lng);
  const bounds = new google.maps.LatLngBounds(southWestLatLng, northEastLatLng);
  map.fitBounds(bounds);
};
//------------------------------------------------------------------------------
/**
* @summary Add marker after the map is loaded.
* @param {object} center - Marker center.
*/
/* GoogleMaps.api.getBounds = () => {
  console.log(map);
  const bounds = map.getBounds();
  console.log(bounds);
  console.log({
    southWest: {
      lat: bounds.getSouthWest().lat(),
      lng: bounds.getSouthWest().lng(),
    },
    northEast: {
      lat: bounds.getNorthEast().lat(),
      lng: bounds.getNorthEast().lng(),
    },
  });
}; */
//------------------------------------------------------------------------------
/**
* @summary Add marker.
* @param {object} coordinates - Marker coordinates { lat, lng }.
* @see {@link https://developers.google.com/maps/documentation/javascript/infowindows}
*/
GoogleMaps.api.addMarker = (coordinates, title, content) => {
  check(coordinates, {
    lat: Number,
    lng: Number,
  });
  check([title, content], [Match.Optional(String)]);

  // Set marker
  const { lat, lng } = coordinates;
  const position = new google.maps.LatLng(lat, lng);
  const marker = new google.maps.Marker({ map, position, [title && 'title']: title });

  // Attach info window on click event
  if (content) {
    const infoWindow = new google.maps.InfoWindow({ content, maxWidth: 250 });
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }

  // Save into markers array
  markers.push(marker);
};
//------------------------------------------------------------------------------
/**
* @summary Fit map bounds.
*/
GoogleMaps.api.fitBounds = (bounds) => {
  map.fitBounds(bounds);
};
//------------------------------------------------------------------------------
/**
* @summary Remove all markers.
*/
GoogleMaps.api.clearMarkers = () => {
  // Removes the markers from the map.
  _.each(markers, (marker) => {
    marker.setMap(null);
  });
};
//------------------------------------------------------------------------------
/**
* @summary Get street name & number.
* @example 12 Wellington St W
*/
GoogleMaps.api.getStreetNameAndNumber = (description) => {
  check(description, String);

  const tokens = description.split(',');
  return tokens.length > 0 && tokens[0] || '';
};
//------------------------------------------------------------------------------
/**
* @summary Get Suburb.
* @example Toronto
*/
GoogleMaps.api.getCityName = (description) => {
  check(description, String);

  const tokens = description.split(',');
  return tokens.length > 1 && tokens[1] || '';
};
//------------------------------------------------------------------------------
/**
* @summary Get Ontario M5E 1G9.
* @example Toronto
*/
/* GoogleMaps.api.getStateName = function (placeName) {
  check(placeName, String);

  const tokens = placeName.split(',');
  return tokens.length > 2 && tokens[2] || '';
}; */
//------------------------------------------------------------------------------
/**
* @summary Get region.
* @example Toronto, Ontario M5E 1G9, Canada
*/
GoogleMaps.api.getRegion = (description) => {
  check(description, String);

  const index = _.indexOf(description, ',');
  const region = description.substr(index + 2); // remove street name and number
  return region;
};
//------------------------------------------------------------------------------
/**
* @summary Check if place is empty.
*/
GoogleMaps.api.placeIsEmpty = (place) => {
  check(place, {
    placeId: String,
    description: String,
    center: Object,
    // radius: Number,
  });

  if (!place) {
    return true;
  }
  const { placeId, description, center /*, radius */ } = place;
  return !placeId || !description || !center || !center.lat || !center.lng; // || !radius;
};
//------------------------------------------------------------------------------
/**
* @summary Check if map bouns is empty.
*/
/* GoogleMaps.api.mapBoundsIsEmpty = (bounds) => {
  check(bounds, {
    southWest: {
      lat: Number,
      lng: Number,
    },
    northEast: {
      lat: Number,
      lng: Number,
    },
  });
  const { southWest, northEast } = bounds;
  return !southWest || !northEast || !southWest.lat || !southWest.lng || !northEast.lat || !northEast.lng
    || southWest.lat === Constants.GOOGLE_MAPS_LAT_OUT_OF_BOUND
    || southWest.lng === Constants.GOOGLE_MAPS_LNG_OUT_OF_BOUND
    || northEast.lat === Constants.GOOGLE_MAPS_LAT_OUT_OF_BOUND
    || !northEast.lng === Constants.GOOGLE_MAPS_LNG_OUT_OF_BOUND;
}; */
//------------------------------------------------------------------------------
/**
* @summary Check if place is empty.
*/
/* GoogleMaps.api.placeIsEmpty = function (place) {
  console.log(place);
  check(place, {
    placeId: String,
    description: String,
    location: [Number],
  });
  const { placeId, description, location } = place;
  return !placeId || !description || !location[0] || !location[1];
}; */
//------------------------------------------------------------------------------
/**
* @summary Check if places are equal.
*/
/* GoogleMaps.api.placesAreEqual = (place1, place2) => {
  check([place1, place2], [{
    placeId: String,
    description: String,
    coordinates: Object,
  }]);

  // console.log(`place1.placeId: ${place1.placeId}, place2.placeId: ${place2.placeId}`);
  // console.log(`place1.description: ${place1.description}, place2.description: ${place2.description}`);
  // console.log(`place1.coordinates: ${place1.coordinates}, place2.coordinates: ${place2.coordinates}`);

  return place1.placeId === place2.placeId && place1.description === place2.description
    && place1.coordinates.lat === place2.coordinates.lat && place1.coordinates.lng === place2.coordinates.lng;
}; */
//------------------------------------------------------------------------------
/**
* @summary Check if center is empty.
*/
/* GoogleMaps.api.centerIsEmpty = function (center) {
  check(center, [Number]);

  return center.length === 0;
}; */
//------------------------------------------------------------------------------
/**
* @summary Check if centers are equal.
*/
/* GoogleMaps.api.centersAreEqual = function (center1, center2) {
  check([center1, center2], [[Number]]);

  // console.log(`place1.id: ${place1.id}, place2.id: ${place2.id}`);
  // console.log(`place1.placeName: ${place1.placeName}, place2.placeName: ${place2.placeName}`);
  // console.log(`place1.center: ${place1.center}, place2.center: ${place2.center}`);
  if (center1.length !== center2.length) {
    return false;
  }
  if (center1.length === 0) {
    return true;
  }
  return center1[0] === center2[0] && center1[1] === center2[1];
}; */
//------------------------------------------------------------------------------
