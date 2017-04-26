import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

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
    randomString: String
  }

  type Query {
    user(_id: String!): User
    curUser: User # 'curUser' refers to the 'query name' and 'User' to the returned type
    allUsers: [User]
  }

  type Mutation {
    updateCurUserSettings(location: String!): User
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
  },
};
// }
