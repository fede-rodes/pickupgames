import React from 'react';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

// Integration with google analytics. See: https://github.com/apollographql/GitHunt-React/blob/master/ui/client.js
// import * as ReactGA from 'react-ga';

import Routes from './routes.js';

const history = createBrowserHistory();

/*
// Initialize Analytics
ReactGA.initialize('UA-74643563-4');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}
*/

const App = () => (
  <Router history={history} /* onUpdate={logPageView} */>
    <Routes />
  </Router>
);

export default App;

/* import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'underscore';
import LoadingPage from '../pages/loading-page.jsx';
import LoginPage from '../pages/login/login-page.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
/**
* @summary Second top-most component acting as a general controller for the whole app.
* It takes care of global subscriptions (displaying a loading indicator when
* global subscriptions aren't ready) + handles authentication (and roles).
* @see {@link https://themeteorchef.com/snippets/authentication-with-react-and-flow-router/}

const App = ({ content, meteorData }) => {
  const { subsReady, loggingIn, loggedIn } = meteorData;

  // Handle loading indicator
  if (!subsReady || loggingIn) return <LoadingPage />;

  // Render login page if user is not authenticated
  if (!loggedIn) return <LoginPage />;

  // Otherwise, render requested page
  return content();
};

App.propTypes = {
  content: PropTypes.func.isRequired, // component to be displayed, ex. <FeedPageContainer />
  meteorData: PropTypes.shape({
    loggingIn: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    subsReady: PropTypes.bool.isRequired,
  }).isRequired,
};
//------------------------------------------------------------------------------
/**
* @summary Container wrapper around App to handle Meteor reactive data.
* @see {@link https://themeteorchef.com/snippets/authentication-with-react-and-flow-router/}

const AppContainer = createContainer(({ content }) => {
  // Global subsriptions
  const handles = [
    Meteor.subscribe('Users.publications.curUser'),
  ];

  // Are all subsriptions ready?
  const subsReady = _.every(handles, handle => handle.ready()); // bool

  // Populate App component props
  return {
    content,
    meteorData: {
      loggingIn: !!Meteor.loggingIn(),
      loggedIn: !!Meteor.user(),
      subsReady,
    },
  };
}, App);

export default AppContainer; */
