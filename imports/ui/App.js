import React from 'react';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

// Integration with google analytics. See: https://github.com/apollographql/GitHunt-React/blob/master/ui/client.js
// import * as ReactGA from 'react-ga';

import Routes from './Routes.js';

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
