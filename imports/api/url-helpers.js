import { check, Match } from 'meteor/check';
import _ from 'underscore';
import Constants from './constants.js';

/**
* @namespace UrlHelpers
*/
const UrlHelpers = {};

//------------------------------------------------------------------------------
UrlHelpers.validateFields = (searchType, values) => {
  // console.log(values);
  check(searchType, Match.OneOf('place', 'mapBounds'));
  /* check(values, Match.OneOf(
    {
      placeId: String,
      description: String,
      center: {
        lat: Number,
        lng: Number,
      },
      radius: Number,
    },
    {
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
    }
  )); */

  if (!values) {
    return false;
  }

  if (searchType === 'place') {
    const { placeId, description, center, radius } = values;
    if (!placeId || !description || !center || !radius) {
      return false;
    }
    const { lat, lng } = center;
    if (!lat || !lng) {
      return false;
    }
  } else if (searchType === 'mapBounds') {
    const { southWest, northEast, center } = values;
    if (!southWest || !northEast || !center) {
      return false;
    }
    if (!southWest.lat || !southWest.lng || !northEast.lat || !northEast.lng
        || !center.lat || !center.lng) {
      return false;
    }
  }

  return true;
};
//------------------------------------------------------------------------------
UrlHelpers.getPlaceAndMapBounds = (params, queryParams) => {
  let place = {};
  let mapBounds = {};

  switch (params.searchType) {
    case 'place': {
      const { placeId, description, lat, lng, radius } = queryParams;
      place = {
        placeId,
        description,
        center: {
          lat: parseFloat(lat, 10),
          lng: parseFloat(lng, 10),
        },
        radius: parseInt(radius, 10) || Constants.FEED_MAX_RADIUS,
      };

      // Make sure fields are valid, otherwise set target to {}
      if (!UrlHelpers.validateFields('place', place)) {
        place = {};
      }
      break;
    }

    case 'mapBounds': {
      const { sWLat, sWLng, nELat, nELng, centerLat, centerLng } = queryParams;
      mapBounds = {
        southWest: {
          lat: parseFloat(sWLat, 10),
          lng: parseFloat(sWLng, 10),
        },
        northEast: {
          lat: parseFloat(nELat, 10),
          lng: parseFloat(nELng, 10),
        },
        center: {
          lat: parseFloat(centerLat, 10),
          lng: parseFloat(centerLng, 10),
        },
      };

      // Make sure fields are valid, otherwise set target to {}
      if (!UrlHelpers.validateFields('mapBounds', mapBounds)) {
        mapBounds = {};
      }
      break;
    }

    default:
      throw new Error('wrong searchType value at UrlHelpers.getPlaceAndMapBounds');

  }

  return { place, mapBounds };
};
//------------------------------------------------------------------------------
UrlHelpers.genRouteParams = (view, searchType, data) => {
  check(view, Match.OneOf('list', 'map'));
  check(searchType, Match.OneOf('place', 'mapBounds'));
  /* check(data, Match.OneOf({
    place: {
      placeId: String,
      description: String,
      center: Object,
      radius: Number,
    },
    mapBounds: Match.OneOf({
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
    }, {}),
    zoom: Number,
  }); */

  if (!_.isEmpty(data)) {
    if (searchType === 'place') {
      const { placeId, description, center, radius } = data;
      const { lat, lng } = center;
      return {
        parms: {
          view,
          searchType,
        },
        queryParams: {
          placeId,
          description,
          lat,
          lng,
          radius: radius || Constants.FEED_MAX_RADIUS,
          zoom: Constants.FEED_DEFAULT_ZOOM,
          pageNumber: 1,
        },
      };
    } else if (searchType === 'mapBounds') {
      const { southWest, northEast, center, zoom } = data;
      return {
        params: {
          view,
          searchType,
        },
        queryParams: {
          sWLat: southWest.lat,
          sWLng: southWest.lng,
          nELat: northEast.lat,
          nELng: northEast.lng,
          centerLat: center.lat,
          centerLng: center.lng,
          zoom: zoom || Constants.FEED_DEFAULT_ZOOM,
          pageNumber: 1,
        },
      };
    }
  }
  return {
    parms: {
      view: view || 'list',
      searchType: searchType || 'place',
    },
    queryParams: {},
  };
};
//------------------------------------------------------------------------------

export default UrlHelpers;
