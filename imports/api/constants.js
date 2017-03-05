/**
* @namespace Constants
*/
const Constants = {
  MARKER_SPORTS_ARRAY: [
    'archery',
    'badminton',
    'baseball',
    'basketball',
    'bootcamp',
    'bike-polo',
    'bowling',
    'climbing',
    'cricket',
    'cycling',
    'football',
    'frisbee',
    'hockey',
    'icehockey',
    'iceskating',
    'karting',
    'lasertag',
    'paddle',
    'paintball',
    'table-tennis',
    'running',
    'squash',
    'tennis',
    'trekking',
    'volleyball',
  ],
  MARKER_TITLE_MAX_LENGTH: 100,
  MARKER_DESCRIPTION_MAX_LENGTH: 10000,
  MARKER_FIELD_TYPE_MAX_LENGTH: 70,
  MARKER_DURATION_MAX_LENGTH: 40,
  POST_CONTENT_MAX_LENGTH: 2000,
  GOOGLE_MAPS_AUTOCOMPLETE_OFFSET: 1, // Minimum num of chars to start searching
  GOOGLE_MAPS_LAT_OUT_OF_BOUND: -90,
  GOOGLE_MAPS_LNG_OUT_OF_BOUND: -190,
  FEED_RECORDS_PER_PAGE: 20,
  FEED_MIN_RADIUS: 1,
  FEED_MAX_RADIUS: 10,
  FEED_DEFAULT_ZOOM: 9,
  USER_DEFAULT_COUNTRY: 'Netherlands',
  USER_DEFAULT_LAT: 52.216668,
  USER_DEFAULT_LNG: 6.8869614,
};

export default Constants;
