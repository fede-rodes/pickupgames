import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import _ from 'underscore';
import { EJSON } from 'meteor/ejson';
import GoogleMaps from '../namespace.js';
import Constants from '../../constants.js';

//------------------------------------------------------------------------------
/**
* @summary HTTP.get request for google maps autocomplete API.
* @param {string} address - Address
* @see {@link https://developers.google.com/places/web-service/autocomplete?utm_source=welovemapsdevelopers&utm_campaign=mdr-gdl#style_autocomplete}
*/
GoogleMaps.api.autocomplete = (address) => {
  check(address, String);

  // Minimum num of chars to start searching
  if (address.length < Constants.GOOGLE_MAPS_AUTOCOMPLETE_OFFSET) {
    return [];
  }

  const apiKey = Meteor.settings.googleMaps.apiKey;
  // Format: https://maps.googleapis.com/maps/api/place/autocomplete/output?parameters
  const endpoint = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
  const params = {
    input: address,
    types: 'geocode',
    key: apiKey,
  };
  let result = '';

  try {
    result = HTTP.get(endpoint, { params });
  } catch (e) {
    console.log(e);
    console.log(`ERROR at GoogleMaps.api.autocomplete. Unable to fetch data for address: ${address}`);
    return [];
  }

  // JSON to object
  /* console.log('result:');
  console.log(result);
  console.log(typeof(result)); */
  // const result = EJSON.parse(resultJSON);
  // console.log('result:');
  // console.log(result);
  const content = EJSON.parse(result.content);
  const options = content.status === 'OK' &&
    content.predictions.map(({ description, place_id }) => (
      { placeId: place_id, description }
    ));

  // console.log(options);
  return options || [];
};

/*
Example result for query: 'input=Paris&types=geocode':
result: {
  statusCode: 200,
  content: '{
    "status": "OK",
    "predictions" : [
      {
        "description" : "Paris, France",
        "id" : "691b237b0322f28988f3ce03e321ff72a12167fd",
        "matched_substrings" : [
          {
            "length" : 5,
            "offset" : 0
          }
        ],
        "place_id" : "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
        "reference" : "CjQlAAAA_KB6EEceSTfkteSSF6U0pvumHCoLUboRcDlAH05N1pZJLmOQbYmboEi0SwXBSoI2EhAhj249tFDCVh4R-PXZkPK8GhTBmp_6_lWljaf1joVs1SH2ttB_tw",
        "terms" : [
          {
            "offset" : 0,
            "value" : "Paris"
          },
          {
            "offset" : 7,
            "value" : "France"
          }
        ],
        "types" : [ "locality", "political", "geocode" ]
      },
      {
        "description" : "Paris Avenue, Earlwood, New South Wales, Australia",
        "id" : "359a75f8beff14b1c94f3d42c2aabfac2afbabad",
        "matched_substrings" : [
          {
            "length" : 5,
            "offset" : 0
          }
        ],
        "place_id" : "ChIJrU3KAHG6EmsR5Uwfrk7azrI",
        "reference" : "CkQ2AAAARbzLE-tsSQPgwv8JKBaVtbjY48kInQo9tny0k07FOYb3Z_z_yDTFhQB_Ehpu-IKhvj8Msdb1rJlX7xMr9kfOVRIQVuL4tOtx9L7U8pC0Zx5bLBoUTFbw9R2lTn_EuBayhDvugt8T0Oo",
        "terms" : [
          {
            "offset" : 0,
            "value" : "Paris Avenue"
          },
          {
            "offset" : 14,
            "value" : "Earlwood"
          },
          {
            "offset" : 24,
            "value" : "New South Wales"
          },
          {
            "offset" : 41,
            "value" : "Australia"
          }
        ],
        "types" : [ "route", "geocode" ]
      },
      {
        "description" : "Paris Street, Carlton, New South Wales, Australia",
        "id" : "bee539812eeda477dad282bcc8310758fb31d64d",
        "matched_substrings" : [
          {
            "length" : 5,
            "offset" : 0
          }
        ],
        "place_id" : "ChIJCfeffMi5EmsRp7ykjcnb3VY",
        "reference" : "CkQ1AAAAAERlxMXkaNPLDxUJFLm4xkzX_h8I49HvGPvmtZjlYSVWp9yUhQSwfsdveHV0yhzYki3nguTBTVX2NzmJDukq9RIQNcoFTuz642b4LIzmLgcr5RoUrZhuNqnFHegHsAjtoUUjmhy4_rA",
        "terms" : [
          {
            "offset" : 0,
            "value" : "Paris Street"
          },
          {
            "offset" : 14,
            "value" : "Carlton"
          },
          {
            "offset" : 23,
            "value" : "New South Wales"
          },
          {
            "offset" : 40,
            "value" : "Australia"
          }
        ],
        "types" : [ "route", "geocode" ]
      },
      ...additional results ...
    ]
  }'
}
*/
//------------------------------------------------------------------------------
/**
* @summary HTTP.get request for google maps place details API.
* @see {@link https://developers.google.com/places/web-service/details}
*/
GoogleMaps.api.placeDetails = (placeId) => {
  check(placeId, String);

  const apiKey = Meteor.settings.googleMaps.apiKey;
  // Format: https://maps.googleapis.com/maps/api/place/details/output?parameters
  const endpoint = 'https://maps.googleapis.com/maps/api/place/details/json';
  const params = {
    placeid: placeId,
    key: apiKey,
  };
  let result = '';

  try {
    result = HTTP.get(endpoint, { params });
  } catch (e) {
    console.log(e);
    console.log(`ERROR at GoogleMaps.api.placeDetails. Unable to fetch data for placeId: ${placeId}`);
    return [];
  }

  // JSON to object
  /* console.log('result:');
  console.log(result);
  console.log(typeof(result)); */
  // const result = EJSON.parse(resultJSON);
  // console.log('result:');
  // console.log(result);
  const content = EJSON.parse(result.content);
  const location = content.status === 'OK' && content.result && content.result.geometry
    && content.result.geometry.location; // { lat, lng }

  return location;
};

/*
Example result for query: 'input=Paris&types=geocode':
result: {
  statusCode: 200,
  content: '{
     "html_attributions" : [],
     "result" : {
        "address_components" : [
           {
              "long_name" : "48",
              "short_name" : "48",
              "types" : [ "street_number" ]
           },
           {
              "long_name" : "Pirrama Road",
              "short_name" : "Pirrama Road",
              "types" : [ "route" ]
           },
           {
              "long_name" : "Pyrmont",
              "short_name" : "Pyrmont",
              "types" : [ "locality", "political" ]
           },
           {
              "long_name" : "NSW",
              "short_name" : "NSW",
              "types" : [ "administrative_area_level_1", "political" ]
           },
           {
              "long_name" : "AU",
              "short_name" : "AU",
              "types" : [ "country", "political" ]
           },
           {
              "long_name" : "2009",
              "short_name" : "2009",
              "types" : [ "postal_code" ]
           }
        ],
        "formatted_address" : "48 Pirrama Road, Pyrmont NSW, Australia",
        "formatted_phone_number" : "(02) 9374 4000",
        "geometry" : {
           "location" : {
             "lat" : -33.8669710,
             "lng" : 151.1958750
           },
           "viewport" : {
              "northeast" : {
                 "lat" : -33.8665053,
                 "lng" : 151.1960371
              },
              "southwest" : {
                 "lat" : -33.8669293,
                 "lng" : 151.1952183
              }
           }
        },
        "icon" : "http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png",
        "id" : "4f89212bf76dde31f092cfc14d7506555d85b5c7",
        "international_phone_number" : "+61 2 9374 4000",
        "name" : "Google Sydney",
        "place_id" : "ChIJN1t_tDeuEmsRUsoyG83frY4",
        "scope" : "GOOGLE",
        "alt_ids" : [
           {
              "place_id" : "D9iJyWEHuEmuEmsRm9hTkapTCrk",
              "scope" : "APP"
           }
        ],
        "rating" : 4.70,
        "reference" : "CnRsAAAA98C4wD-VFvzGq-KHVEFhlHuy1TD1W6UYZw7KjuvfVsKMRZkbCVBVDxXFOOCM108n9PuJMJxeAxix3WB6B16c1p2bY1ZQyOrcu1d9247xQhUmPgYjN37JMo5QBsWipTsnoIZA9yAzA-0pnxFM6yAcDhIQbU0z05f3xD3m9NQnhEDjvBoUw-BdcocVpXzKFcnMXUpf-nkyF1w",
        "reviews" : [
           {
              "aspects" : [
                 {
                    "rating" : 3,
                    "type" : "quality"
                 }
              ],
              "author_name" : "Simon Bengtsson",
              "author_url" : "https://plus.google.com/104675092887960962573",
              "language" : "en",
              "rating" : 5,
              "text" : "Just went inside to have a look at Google. Amazing.",
              "time" : 1338440552869
           },
           {
             "aspects" : [
                {
                   "rating" : 3,
                   "type" : "quality"
                }
               ],
              "author_name" : "Felix Rauch Valenti",
              "author_url" : "https://plus.google.com/103291556674373289857",
              "language" : "en",
              "rating" : 5,
              "text" : "Best place to work :-)",
              "time" : 1338411244325
           },
           {
             "aspects" : [
                {
                   "rating" : 3,
                   "type" : "quality"
                }
               ],
              "author_name" : "Chris",
              "language" : "en",
              "rating" : 5,
              "text" : "Great place to work, always lots of free food!",
              "time" : 1330467089039
           }
        ],
        "types" : [ "establishment" ],
        "url" : "http://maps.google.com/maps/place?cid=10281119596374313554",
        "vicinity" : "48 Pirrama Road, Pyrmont",
        "website" : "http://www.google.com.au/"
     },
     "status" : "OK"
  }'
} */
//------------------------------------------------------------------------------
