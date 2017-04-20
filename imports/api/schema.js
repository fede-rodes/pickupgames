// import { Meteor } from 'meteor/meteor';
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

  type User {
    _id: String
    emails: [Email]
    randomString: String
    name: String,
  }

  type Query {
    curUser: User # 'curUser' refers to the 'query name' and 'User' to the returned type
  }
  `,
];

export const resolvers = {
  Query: {
    curUser(root, args, context) {
      /*
       * We access to the current user here thanks to the context. The current
       * user is added to the context thanks to the `meteor/apollo` package.
       */
      return context.user;
    },
  },
  // What's this for?
  User: {
    emails: ({ emails }) => emails,
    randomString: () => Random.id(),
  },
};
// }
