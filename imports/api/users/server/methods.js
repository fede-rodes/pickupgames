import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import _ from 'underscore';
import { IPGeocoder } from 'meteor/thebakery:ipgeocoder';
import { headers } from 'meteor/gadicohen:headers';
// import { AuxFunctions } from '../aux-functions.js';
import Constants from '../../constants.js';
import Users from '../namespace.js';
import '../api.js'; // Users.api

//------------------------------------------------------------------------------
// AUX FUNCTIONS:
//------------------------------------------------------------------------------
const displayCountryName = (geoData) => {
  check(geoData, Object);

  if (geoData && geoData.country && geoData.country.name) {
    console.log('COUNTRY: ', geoData.country.name);
  }
  console.log('CANT DETERMINE COUNTRY!');
};
//------------------------------------------------------------------------------
/* const getCountryName = (geoData) => {
  check(geoData, Object);

  if (geoData && geoData.country && geoData.country.name) {
    return geoData.country.name;
  }
  return undefined;
}; */
//------------------------------------------------------------------------------
const isBot = (userAgent) => {
  check(userAgent, String);

  // string.match returns null if not match is found, array with matched values
  // otherwise
  const match = userAgent.match(/curl|Bot|B-O-T|Crawler|Spider|Spyder|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|Charlotte|NewsGator|TinEye|Cerberian|SearchSight|Zao|Scrubby|Qseero|PycURL|Pompos|oegp|SBIder|yoogliFetchAgent|yacy|webcollage|VYU2|voyager|updated|truwoGPS|StackRambler|Sqworm|silk|semanticdiscovery|ScoutJet|Nymesis|NetResearchServer|MVAClient|mogimogi|Mnogosearch|Arachmo|Accoona|holmes|htdig|ichiro|webis|LinkWalker|lwp-trivial/i);
  return !_.isNull(match);
};
//------------------------------------------------------------------------------
/**
* @summary Returns user's location based on IP address.
* @see {@link https://github.com/thebakeryio/meteor-ipgeocoder}
* OBS: headers must be called within a Meteor.method
*/
Meteor.methods({ 'Users.methods.getCurUserLocation'() {
  // 'unblocks' a Method from needing to finish before other Methods are executed.
  this.unblock();

  const defaultGeoData = {
    country: {
      name: Constants.USER_DEFAULT_COUNTRY,
    },
    location: {
      latitude: Constants.USER_DEFAULT_LAT,
      longitude: Constants.USER_DEFAULT_LNG,
    },
  };

  let ip = headers.get(this, 'x-forwarded-for'); // string
  const userAgent = headers.get(this, 'user-agent'); // string
  // ip = '130.89.230.77'; // (Netherlands) testing only
  ip = '157.92.29.3'; // (Argentina) testing only

  // Is IP address set?
  if (!ip || ip === '') {
    return defaultGeoData;
  }
  console.log(`IP: ${ip}`);

  // Is user agent set?
  if (!userAgent || userAgent === '') {
    return defaultGeoData.location;
  }
  console.log(`USER AGENT: ${userAgent}`);

  // Is it a Bot?
  if (isBot(userAgent)) {
    console.log('BOT!!');
    return defaultGeoData;
  }

  // Not a Bot, calculate location...
  let geoData = null;
  try {
    geoData = IPGeocoder.geocode(ip);
  } catch (e) {
    console.log(e);
    console.log(`Can\'t get location data at Users.methods.getCurUserLocation: ${e}`);
    return defaultGeoData;
  }

	// In case no results were found, set default and return
  if (!geoData || !geoData.location) {
    console.log('No geoData, return default');
    return defaultGeoData;
  }

  displayCountryName(geoData);
  return geoData;
} });
/*
Result format:
const geoData = {
  city: {
    name: "Neuilly-sur-Seine"
  },
  continent: {
    name: "Europe",
    code: "EU"
  },
  country: {
    name: "France",
    code: "FR"
  },
  location: {
    latitude: 48.8833,
    longitude: 2.2667,
    time_zone: "Europe/Paris"
  }
}
*/
//------------------------------------------------------------------------------
/**
* @summary Save user search values.
*/
Meteor.methods({ 'Users.methods.updateSearchValue'({ searchType, place, mapBounds, zoom }) {
  // 'unblocks' a Method from needing to finish before other Methods are executed.
  this.unblock();

  check(searchType, Match.OneOf('place', 'mapBounds'));
  check(place, Match.OneOf({
    placeId: String,
    description: String,
    center: {
      lat: Number,
      lng: Number,
    },
    radius: Number,
  }, {}));
  check(mapBounds, Match.OneOf({
    southWest: {
      lat: Number,
      lng: Number,
    },
    northEast: {
      lat: Number,
      lng: Number,
    },
    center: {
      lat: Number,
      lng: Number,
    },
  }, {}));
  check(zoom, Match.Optional(Number));

  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at Users.methods.updateSearchValue');
  }

  const modifier = {};

  if (searchType === 'place' && !_.isEmpty(place)) {
    const { placeId, description, center, radius } = place;
    const { lat, lng } = center;
    _.extend(modifier, {
      $set: {
        searchValue: {
          place: {
            placeId,
            description,
            center: {
              lngLat: [lng, lat],
            },
            radius,
          },
          map: {},
        },
      },
    });
  } else if (searchType === 'mapBounds' && !_.isEmpty(mapBounds)) {
    const { southWest, northEast, center } = mapBounds;
    _.extend(modifier, {
      $set: {
        searchValue: {
          map: {
            bounds: {
              southWest: {
                lngLat: [southWest.lng, southWest.lat],
              },
              northEast: {
                lngLat: [northEast.lng, northEast.lat],
              },
            },
            center: {
              lngLat: [center.lng, center.lat],
            },
            zoom,
          },
          place: {},
        },
      },
    });
  } else {
    return;
  }

  Meteor.users.update({ _id: curUserId }, modifier);
} });
//------------------------------------------------------------------------------
/**
* @summary Save user search values.
*/
/* Meteor.methods({ 'Users.methods.updateSearchValue'(params) {
  // 'unblocks' a Method from needing to finish before other Methods are executed.
  this.unblock();

  check(params, {
    searchType: Match.OneOf('place', 'mapBounds'),
    place: Match.Optional({
      placeId: String,
      description: String,
      center: {
        lat: Number,
        lng: Number,
      },
      radius: Number,
    }),
    mapBounds: Match.Optional({
      southWest: {
        lat: Number,
        lng: Number,
      },
      northEast: {
        lat: Number,
        lng: Number,
      },
      center: {
        lat: Number,
        lng: Number,
      },
    }),
    zoom: Match.Optional(Number),
  });

  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at Users.methods.updateSearchValue');
  }

  const {
    searchType,
    place,
    mapBounds,
    zoom,
  } = params;

  const modifier = {};

  if (searchType === 'place') {
    const { placeId, description, center, radius } = place;
    const { lat, lng } = center;
    _.extend(modifier, {
      $set: {
        searchValue: {
          place: {
            placeId,
            description,
            center: {
              lngLat: [lng, lat],
            },
            radius,
          },
          map: {},
        },
      },
    });
  } else if (searchType === 'mapBounds') {
    const { southWest, northEast, center } = mapBounds;
    _.extend(modifier, {
      $set: {
        searchValue: {
          map: {
            bounds: {
              southWest: {
                lngLat: [southWest.lng, southWest.lat],
              },
              northEast: {
                lngLat: [northEast.lng, northEast.lat],
              },
            },
            center: {
              lngLat: [center.lng, center.lat],
            },
            zoom,
          },
          place: {},
        },
      },
    });
  }

  console.log(modifier);
  //// const modifier = {
    $set: {
      searchValue: {
        [searchType === 'place' && 'place']: {
          placeId,
          description,
          coordinates: {
            lngLat: [lng, lat],
          },
          radius,
        },
        [searchType === 'mapBounds' && 'place']: {},
        [searchType === 'mapBounds' && 'map']: {
          bounds: {
            southWest: {
              lngLat: [southWest.lng, southWest.lat],
            },
            northEast: {
              lngLat: [northEast.lng, northEast.lat],
            },
            center: {
              lngLat: [center.lng, center.lat],
            },
            zoom,
          },
        },
        [searchType === 'place' && 'map']: {},
      },
    },
  }; ////

  Meteor.users.update({ _id: curUserId }, modifier);
} }); */
//------------------------------------------------------------------------------
/* Meteor.methods({ 'Users.methods.updateSearchValue'(params) {
  // 'unblocks' a Method from needing to finish before other Methods are executed.
  this.unblock();

  check(params, {
    placeId: String,
    description: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    radius: Number,
  });

  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at PostsSystem.methods.createPost');
  }

  const { placeId, description, coordinates, radius } = params;
  const { lat, lng } = coordinates;
  const modifier = {
    $set: {
      default: {
        location: {
          placeId,
          description,
          radius,
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        },
      },
    },
  };

  Meteor.users.update({ _id: curUserId }, modifier);
} }); */
