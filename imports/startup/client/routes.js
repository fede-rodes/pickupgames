import React from 'react';
import { Route } from 'react-router-dom';

// import DefaultLayout from './layouts/default';
import FeedPageContainer from '../../ui/pages/feed/feed-page.jsx';
import NewMarkerPageContainer from '../../ui/pages/new-marker/new-marker-page.jsx';
import MarkerPageContainer from '../../ui/pages/marker/marker-page.jsx';
import AdminMarkerPageContainer from '../../ui/pages/admin-marker/admin-marker-page.jsx';
// import ProfilePageContainer from '../../ui/pages/profile/profile-page.jsx';
// import CommentsPage from '../../ui/pages/comments-page.jsx';

const Routes = () => (
  <div>
    <Route exact path="/" component={FeedPageContainer} />
    {/* <Route exact path="/settings" component={Settings} /> */}
    <Route exact path="/create-activity" component={NewMarkerPageContainer} />
    <Route exact path="/activity-details" component={MarkerPageContainer} />
    <Route exact path="/admin-activity" component={AdminMarkerPageContainer} />
  </div>
);

export default Routes;
