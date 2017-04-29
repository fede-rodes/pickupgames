import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
// import { check, Match } from 'meteor/check';
import { find } from 'lodash';
// import AuxFunctions from '../../api/aux-functions.js';
import Markers from '../../api/markers/namespace.js';
import '../../api/markers/api.js'; // Activities.api
import '../../api/markers/server/api.js'; // Activities.api
import '../../api/markers/collection.js'; // Activities.collection
// import Users from '../users/namespace.js';
// import '../users/api.js'; // Users.api

// Checking that typeDefs and resolver are only necessary/used server side for
// the express server configuration.
// if (Meteor.isServer) {
export const typeDefs = [
  `
  type Email {
    address: String
    verified: Boolean
  }

  type Settings {
    location: String
  }

  type User {
    _id: String
    name: String
    #settings: Settings
    location: String
    emails: [Email]
    createdMarkers: [String]
    joinedMarkers: [String]
    randomString: String
  }

  type Activity {
  	_id: String
  	sport: String
  	venueId: String
  	date: String
  	time: String
  	createdBy: String
  	createdAt: String
  	title: String
  	followers: [String]
  	participants: [String]
  	status: String
  	repeat: Boolean
  	admins: [String]
    randomString: String
  }

  type Query {
    user(_id: String!): User
    curUser: User # 'curUser' refers to the 'query name' and 'User' to the returned type
    allUsers: [User]
  }

  enum ACTION_TYPES {
    NEW
    JOIN_UNJOIN
  }

  type Mutation {
    updateCurUserSettings(location: String!): User
    createActivity(sport: String!, venueId: ID!, date: String!, time: String!): Activity
    Users_mutations_attachActivityToUser(activityId: ID!, actionType: ACTION_TYPES!): User
  }
  `,
];

export const resolvers = {
  Query: {
    user(root, args, context) {
      /*
       * We access to the current user here thanks to the context. The current
       * user is added to the context thanks to the `meteor/apollo` package.
       */
      const { _id } = args;
      return Meteor.users.findOne({ _id });
    },
    curUser(root, args, context) {
      /*
       * We access to the current user here thanks to the context. The current
       * user is added to the context thanks to the `meteor/apollo` package.
       */
      return context.user || null;
      /* const curUser = context.user;
      console.log('curUser', curUser);
      const curUserId = curUser._id;
      console.log('curUserExt', Meteor.users.findOne({ _id: curUserId }));
      return Meteor.users.findOne({ _id: curUserId }); */
    },
    allUsers(root, args, context) {
      return Meteor.users.find({}).fetch();
    },
  },
  // What's this for?
  User: {
    emails: ({ emails }) => emails,
    randomString: () => Random.id(),
  },
  Activity: {
    randomString: () => Random.id(),
  },
  Mutation: {
    updateCurUserSettings(root, args, context) {
      console.log('root', root);
      console.log('args', args);
      console.log('context', context);
      const curUser = context.user;
      if (!curUser) {
        console.log('user is not logged in at /schema.js Mutation.updateCurUserSettings');
      }
      const curUserId = curUser._id;
      console.log('curUserId', curUserId);
      const { location } = args;
      Meteor.users.update({ _id: curUserId }, { $set: { location } });
      return Meteor.users.findOne({ _id: curUserId });
    },
    createActivity(root, args, context) {
      console.log('root', root);
      console.log('args', args);
      console.log('context', context);
      const curUser = context.user;
      if (!curUser) {
        console.log('user is not logged in at /schema.js Mutation.createActivity');
      }
      const curUserId = curUser._id;
      console.log('curUserId', curUserId);
      const { sport, venueId, date, time } = args;
      const newActivity = {
        sport,
        venueId,
        date,
        time,
        createdBy: curUserId,
        createdAt: new Date(),
        title: `${sport} @ venue name`,
        followers: [curUserId],
      };

      const activityId = Markers.collection.insert(newActivity);
      return Markers.collection.findOne({ _id: activityId });
    },
    Users_mutations_attachActivityToUser(root, args, context) {
      console.log('root', root);
      console.log('args', args);
      console.log('context', context);
      const curUser = context.user;
      const curUserId = curUser._id;

      // Is the current user logged in?
      if (!curUserId) {
        throw new Error('user is not logged in at Users.mutations.attachActivityToUser');
      }

      // TODO: Check marker existance?
      // Destructure
      const { activityId: markerId, actionType } = args;

      // Set modifier based on actionType and user data
      // const curUser = Meteor.users.findOne({ _id: curUserId });
      let modifier = {};
      switch (actionType) {
        case 'NEW':
          modifier = {
            $addToSet: {
              createdMarkers: markerId,
              // joinedMarkers: markerId,
            },
          };
          break;
        case 'JOIN_UNJOIN': {
          // Is the marker already in the user doc? If so, unjoin, otherwise join.
          const joinedAlready = find(curUser.joinedMarkers, (joinedMarkerId) =>
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
          throw new Error('wrong value at Users.mutations.attachActivityToUser');
      }

      // Update user doc
      Meteor.users.update({ _id: curUserId }, modifier);

      return Meteor.users.findOne({ _id: curUserId });
    },
  },
};
// }
