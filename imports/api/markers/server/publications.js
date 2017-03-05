import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import _ from 'underscore';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Markers from '../namespace.js';
import '../collection.js'; // Markers.collection
import PostsSystem from '../../posts-system/namespace.js';
import '../../posts-system/collection.js'; // PostsSystem.collection

//------------------------------------------------------------------------------
/**
* @see {@link https://atmospherejs.com/reywood/publish-composite}
*/
Meteor.publishComposite('Markers.publications.getMarkerForMarkerPage', function (markerId) {
  check(markerId, String);

  const options = {
    fields: {
      /* 'services.twitter.profile_image_url_https': true,
	   	'services.facebook.id': true,
	   	'services.google.picture': true, */
      avatar: true,
      profile: true,
    },
  };

  return {
    find() {
      // Must return a cursor containing top level documents
      return Markers.collection.find({ _id: markerId }, { limit: 1 });
    },
    children: [{
      find(marker) {
        // Called for each top level document. Top level document is passed
        // in as an argument.
        // Must return a cursor of second tier documents.
        const { createdBy, participants = [] } = marker;
        // Subscribe to all user names involved in this marker
        const userIds = [createdBy].concat(_.pluck(participants, 'userId'));
        return Meteor.users.find({ _id: { $in: userIds } }, options);
      },
    }],
  };
});
//------------------------------------------------------------------------------
Meteor.publish('Markers.publications.getMarkersForProfile', function (markerIds) {
  check(markerIds, [String]);

  // Only publish relevant data
  const projection = {
    fields: {
      title: true,
      description: true,
      location: true,
      date: true,
      time: true,
    },
  };

  return Markers.collection.find({ _id: { $in: markerIds } }, projection);
});
//------------------------------------------------------------------------------
/**
* @see {@link https://themeteorchef.com/snippets/simple-search/}
* @see {@link https://www.okgrow.com/posts/guide-to-full-text-search-in-meteor}
* @see {@link https://atmospherejs.com/reywood/publish-composite}
*/
/* Meteor.publishComposite('Markers.publications.getMarkersForFeedPage', function (params) {
  check(params, {
    query: String,
    limit: Number,
    sortBy: Object, // { createdAt: -1 } or { 'likes.counter': -1 }
  });
  // Meteor._sleepForMs(500);
  const MAX_LIMIT = 100;
  const { query, limit, sortBy } = params;

  const selector = {};

  const options = {
    sort: sortBy,
    limit: Math.min(limit, MAX_LIMIT),
    // fields: {
    //  'participants.userId': false,
    // },
  };

  // If search query is provided, filter results based on query. Otherwise
  // return all results
  console.log(`query: ${query}`);
  if (query.length > 0) {
    // Get search query tokens
    const tokens = _.without(query.split(' '), ''); // array
    const or = [];
    _.each(tokens, (token) => {
      or.push({
        'location.description': new RegExp(token, 'i'),
      });
    });
    // Else return matched valued
    // _.extend(selector, { $or: or });
    _.extend(selector, { $or: or });
  }

  return {
    find() {
      Counts.publish(
        this,
        'Markers.publications.searchMarkersCount',
        Markers.collection.find(selector),
        { noReady: true }
      );
      // Must return a cursor containing top level documents
      // console.log(Markers.collection.find(selector, options).fetch());
      return Markers.collection.find(selector, options);
    },
    children: [{
      find(marker) {
        // Called for each top level document. Top level document is passed
        // in as an argument.
        // Must return a cursor of second tier documents.
        // return PostsSystem.collection.find({ markerId: marker._id }, { fields: { markerId: true } });
        return null;
      },
    }],
  };
}); */
//------------------------------------------------------------------------------
Meteor.publishComposite('Markers.publications.getMarkersForFeedPage', function (params) {
  console.log('Markers.publications.getMarkersForFeedPage', params);
  check(params, {
    searchType: Match.OneOf('place', 'mapBounds'),
    place: Match.OneOf({
      placeId: String,
      description: String,
      center: { // center
        lat: Number,
        lng: Number,
      },
      radius: Number,
    }, {}),
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
    limit: Number,
  });
  // Meteor._sleepForMs(1000);
  const MAX_LIMIT = 100;
  const { searchType, place, mapBounds, limit } = params;

  if (_.isEmpty(place) && _.isEmpty(mapBounds)) {
    return null;
  }

  const selector = {
    /* privacy: 'public',
    status: {
       $ne: 'finished'
    }, */
  };

  const options = {
    /* fields: {
      createdAt: 0,
      'loc.type': 0,
      fieldPhone: 0,
      fieldWebsite: 0,
      privacyOnCreation: 0,
      peopleInOnCreation: 0,
      followers: 0,
    }, */
    limit: Math.min(limit, MAX_LIMIT),
    sort: {
      date: 1,
      time: 1,
    },
  };

  // Extend selector based on params
  if (searchType === 'place') {
    const { center, radius } = place;
    const { lat, lng } = center;
    _.extend(selector, {
      'location.geometry': {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / 3963.2], // radius (miles) / radius of the earth (3963.2 miles)
        },
      },
    });
  } else if (searchType === 'mapBounds') {
    const { southWest, northEast } = mapBounds;
    _.extend(selector, {
      'location.geometry': {
        $geoWithin: {
          $box: [
            [southWest.lng, southWest.lat],
            [northEast.lng, northEast.lat],
          ],
        },
      },
    });
  } else {
    throw new Error('wrong searchType at Markers.publications.getMarkersForFeedPage');
  }

  console.log(selector);

  /* const userOptions = {
    fields: {
    	"services.twitter.profile_image_url_https": 1,
    	"services.facebook.id": 1,
    	"services.google.picture": 1,
       "profile.name": 1
    }
  }; */
  //console.log('activities: ', Matches.find(query, matchOptions).fetch());

  // If coordinates are provided, filter results based on query. Otherwise
  // return all results
  /* if (coordinates) {
    // Get search query tokens
    const tokens = _.without(query.split(' '), ''); // array
    const or = [];
    _.each(tokens, (token) => {
      or.push({
        'location.description': new RegExp(token, 'i'),
      });
    });
    // Else return matched valued
    // _.extend(selector, { $or: or });
    _.extend(selector, { $or: or });
  } */

  return {
    find() {
      Counts.publish(
        this,
        'Markers.publications.searchMarkersCount',
        Markers.collection.find(selector),
        { noReady: true }
      );
      // Must return a cursor containing top level documents
      // console.log(Markers.collection.find(selector, options).fetch());
      return Markers.collection.find(selector, options);
    },
    children: [{
      find(marker) {
        // Called for each top level document. Top level document is passed
        // in as an argument.
        // Must return a cursor of second tier documents.
        const usersIds = _.union([marker.createdBy], _.pluck(marker.participants, 'userId'));
        return Meteor.users.find({ _id: { $in: usersIds } }, { 'profile.name': true, avatar: true });
        // return null;
      },
    }, /* {
      find(marker) {
        // Called for each top level document. Top level document is passed
        // in as an argument.
        // Must return a cursor of second tier documents.
        return PostsSystem.collection.find({ postedOn: marker._id }, { fields: { postedOn: true } });
      },
    } */],
  };
});
//------------------------------------------------------------------------------
