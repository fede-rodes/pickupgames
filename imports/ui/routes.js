import React from 'react';
import { Route } from 'react-router-dom';

import DefaultLayout from './layouts/default';
import Activities from './pages/activities';
import Settings from './pages/settings';

const Routes = () => (
  <DefaultLayout>
    <Route exact path="/" component={Activities} />
    <Route exact path="/settings" component={Settings} />
  </DefaultLayout>
);

export default Routes;


/*
import React from 'react';
import { Route } from 'react-router-dom';
// import Main from '../../ui/layouts/Main';
// import LogIn from '../../ui/containers/LogIn';
import Home from './Home.js';
import Settings from './pages/settings/index.js';

const Routes = () => (
  <div>
    <Route exact path="/" component={Home} />
    //<Route exact path="/login" component={LogIn} />
    <Route exact path="/settings" component={Settings} />
  </div>
);

export default Routes;
*/
