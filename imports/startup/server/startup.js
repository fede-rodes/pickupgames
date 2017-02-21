import { Meteor } from 'meteor/meteor';
// import { IPGeocoder } from 'meteor/thebakery:ipgeocoder';
// import Users from '../../api/users/namespace.js';
// import '../../api/users/api.js'; // Users.api

Meteor.startup(() => {
  console.log('[server] startup');
  // Setup default users
  // Users.api.init();

  // Load IP geocode database
  // IPGeocoder.load();
});
