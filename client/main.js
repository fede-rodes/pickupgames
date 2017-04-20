import { Meteor } from 'meteor/meteor';

import React from 'react';
import { render } from 'react-dom';
// For redux integration see http://dev.apollodata.com/react/redux.html
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import { todoReducer, userReducer } from './reducers';

// ApolloClient serves as a central store of query result data which caches and
// distributes the results of our queries.
import ApolloClient from 'apollo-client';
import { meteorClientConfig } from 'meteor/apollo';

// ApolloProvider makes that client instance (ApolloClient) available to our
// React component hierarchy. We suggest putting the ApolloProvider somewhere
// high in your view hierarchy, above any places where you need to access
// GraphQL data. For example, it could be outside of your root route component
// if you’re using React Router.
import { ApolloProvider } from 'react-apollo';

import App from '../imports/ui/App';

// To get started, create an ApolloClient instance and point it at your GraphQL
// server (handled in our case by meteor-apollo). By default, this client will
// send queries to the `/graphql` endpoint on the same host.
const client = new ApolloClient(meteorClientConfig());
// If your database has unique IDs across all types of objects, you can use
// a very simple function!
// const client = new ApolloClient({
//    dataIdFromObject: o => o.id
// });
// What about this for Meteor-Apollo? See: http://dev.apollodata.com/react/cache-updates.html

const store = createStore(
  combineReducers({
    // todos: todoReducer,
    // users: userReducer,
    apollo: client.reducer(),
  }),
  {}, // initial state
  compose(
    applyMiddleware(client.middleware()) //,
    // If you are using the devToolsExtension, you can add it here also
    // (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  )
);

/*
* The <ApolloProvider/> component takes the following props:
*
* client: The required ApolloClient instance. This ApolloClient instance will be
* used by all of your components enhanced with GraphQL capabilties.
*
* [store]: This is an optional instance of a Redux store. If you choose to pass
* in your Redux store here then <ApolloProvider/> will also provide your Redux
* store like the react-redux <Provider/> component. This means you only need to
* use one provider component instead of two!
*/
Meteor.startup(() => {
  render(
    <ApolloProvider store={store} client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('app')
  );
});
