import React from 'react';
import { Route } from 'react-router-dom';
// import Main from '../../ui/layouts/Main';
// import LogIn from '../../ui/containers/LogIn';
import Home from './Home.js';
import Settings from './Settings.js';

const Routes = () => (
  <div>
    <Route exact path="/" component={Home} />
    {/* <Route exact path="/login" component={LogIn} /> */}
    <Route exact path="/settings" component={Settings} />
  </div>
);

export default Routes;
