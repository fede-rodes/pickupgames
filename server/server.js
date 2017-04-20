import { createApolloServer } from 'meteor/apollo';
import { makeExecutableSchema } from 'graphql-tools';

import { typeDefs, resolvers } from '/imports/api/schema.js';

/*
// For the future (see: https://github.com/apollographql/GitHunt-API/blob/master/api/schema.js):
// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects

const schema = [...rootSchema, ...gitHubSchema, ...sqlSchema];
const resolvers = merge(rootResolvers, gitHubResolvers, sqlResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});
*/


const graphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

/*
* createApolloServer is used to create and configure an Express GraphQL server
* inside a meteor instance. That way, there is no CORS issue -- your Express
* routes are integrated into Meteor and you can navigate to your GraphQL
* endpoint/GraphiQL path just like any other page in your application; for
* instance: http://localhost:3000/graphiql
* createApolloServer(customOptions = {}, customConfig = {})
* see: http://dev.apollodata.com/core/meteor.html#createApolloServer
* See: https://github.com/apollographql/meteor-integration/blob/master/src/main-server.js
*/

/*
* customOptions is an object that can have any GraphQL Server options
* (http://dev.apollodata.com/tools/graphql-server/setup.html#graphqlOptions)
* used to enhance the GraphQL server run thanks to graphqlExpress.
*
* Defining a customOptions object extends or replaces fields of the default configuration provided by the package:
*
*   context: {}, ensure that a context object is defined for the resolvers.
*   formatError: a function used to format errors before returning them to clients.
*   debug: Meteor.isDevelopment, additional debug logging if execution errors occur in dev mode.
*/
const customOptions = {
  schema: graphQLSchema,

  // values to be used as context and rootValue in resolvers
  // context?: any,
  // rootValue?: any,

  // function used to format errors before returning them to clients
  // formatError?: Function,

  // additional validation rules to be applied to client-specified queries
  // validationRules?: Array<ValidationRule>,

  // function applied for each query in a batch to format parameters before passing them to `runQuery`
  // formatParams?: Function,

  // function applied to each response before returning data to clients
  // formatResponse?: Function,

  // a boolean option that will trigger additional debug logging if execution errors occur
  // debug?: boolean
};

/*
* customConfig is an optional object that can be used to replace the configuration of how the Express server itself runs:
*
*   path: path of the GraphQL server. This is the endpoint where the queries & mutations are sent. Default: /graphql.
*   configServer: a function that is given to the express server for further configuration. You can for instance enable CORS with createApolloServer({}, {configServer: expressServer => expressServer.use(cors())})
*   graphiql: whether to enable GraphiQL. Default: true in development and false in production.
*   graphiqlPath: path for GraphiQL. Default: /graphiql (note the i).
*   graphiqlOptions: GraphiQL options Default: attempts to use Meteor.loginToken from localStorage to log you in.
*
* It will use the same port as your Meteor server. Don’t put a route or static asset at the same path as the GraphQL route or the GraphiQL route if in use (again, defaults are /graphql and /graphiql respectively).
*/
const customConfig = {
  /* configServer: expressServer => expressServer.use((req, res, next) => {
    // do something there manually or use an express middleware instead of this custom function
  }), */
};

createApolloServer(customOptions, customConfig);
