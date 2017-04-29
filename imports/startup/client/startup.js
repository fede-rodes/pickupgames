import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import React from 'react';
import { render } from 'react-dom';

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

// Redux integration
import createReduxStore from '../../api/redux/client/store.js';

// Antd
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import App from './app.js';

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

// For redux integration see http://dev.apollodata.com/react/redux.html
const store = createReduxStore(client);

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
  console.log('[client] startup');

  // Set default language
  moment.locale('en');

  render(
    <ApolloProvider store={store} client={client}>
      <LocaleProvider locale={enUS}>
        <App />
      </LocaleProvider>
    </ApolloProvider>,
    document.getElementById('react-root')
  );
});
