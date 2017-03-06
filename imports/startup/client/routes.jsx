import React from 'react';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { EJSON } from 'meteor/ejson';
import Store from '../../api/redux/client/store.js';
const { dispatch } = Store;
import Actions from '../../api/redux/client/actions.js';
import Root from '../../ui/layouts/root.jsx';
import HomePageContainer from '../../ui/pages/home/home-page.jsx';
import FeedPageContainer from '../../ui/pages/feed/feed-page.jsx';
import NewMarkerPageContainer from '../../ui/pages/new-marker/new-marker-page.jsx';
import MarkerPageContainer from '../../ui/pages/marker/marker-page.jsx';
import ProfilePageContainer from '../../ui/pages/profile/profile-page.jsx';
import CommentsPage from '../../ui/pages/comments-page.jsx';
import NotFoundPage from '../../ui/pages/not-found-page.jsx';

console.log('[router] loading routes');

//------------------------------------------------------------------------------
// AUX FUNCTIONS:
//------------------------------------------------------------------------------
/**
* @see {@link https://kadira.io/academy/meteor-routing-guide/content/triggers}
*/
function clearPath(context, redirect) {
  // If facebook login is used at feed page after search, facebook will replace
  // any ocurrences of '&'' with '&amp;' which breaks Flowrouter path. In order
  // to solve this we'll need to replace back '&amp;' with '&'.
  const path = context.path.replace(/&amp;/g, '&');
  if (context.path !== path) {
    redirect(path);
  }
}
//------------------------------------------------------------------------------
function redirectToFeedList(context, redirect) {
  const params = {
    view: 'list',
    searchType: 'place',
  };
  redirect('feed', params, context.queryParams);
}
//------------------------------------------------------------------------------
function clearHomePageReduxState() {
  dispatch(Actions.setInitialState('home'));
}
//------------------------------------------------------------------------------
function clearNewMarkerPageReduxState() {
  dispatch(Actions.setInitialState('newMarker'));
}
//------------------------------------------------------------------------------
function clearPostsSystemReduxState() {
  dispatch(Actions.setInitialState('postsSystem'));
}
//------------------------------------------------------------------------------
// ROUTES:
//------------------------------------------------------------------------------
FlowRouter.route('/', {
  name: 'index',
  action() {
    FlowRouter.go('home');
  },
});

FlowRouter.route('/home', {
  name: 'home',
  action() {
    mount(Root, {
      content: () => <HomePageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  triggersExit: [clearHomePageReduxState],
});

FlowRouter.route('/feed', {
  name: 'feed',
  // Set view and searchType if not provided
  triggersEnter: [redirectToFeedList],
  action() {
    throw new Error('banned route');
  },
});

// queryParams = { placeId, description, lat, lng, radius, sWLat, sWLng, nELat,
// nELng, centerLat, centerLng, zoom, pageNumber }
FlowRouter.route('/feed/:view/:searchType', {
  name: 'feed',
  triggersEnter: [clearPath],
  action(params, queryParams) {
    mount(Root, {
      content: () => <FeedPageContainer
        params={params}
        queryParams={queryParams}
      />,
    });
  },
});

FlowRouter.route('/new-marker', {
  name: 'new-marker',
  action() {
    mount(Root, {
      content: () => <NewMarkerPageContainer />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  triggersExit: [clearNewMarkerPageReduxState],
});

FlowRouter.route('/marker/:markerId', {
  name: 'marker',
  action(params) {
    mount(Root, {
      content: () => <MarkerPageContainer
        markerId={params.markerId}
      />,
    });
  },
  // calls when we decide to move to another route
  // but calls before the next route started
  triggersEnter: [clearPostsSystemReduxState],
});

FlowRouter.route('/profile', {
  name: 'profile',
  action() {
    mount(Root, {
      content: () => <ProfilePageContainer />,
    });
  },
});

FlowRouter.route('/comments', {
  name: 'comments',
  action() {
    mount(Root, {
      content: () => <CommentsPage />,
    });
  },
});

FlowRouter.notFound = {
  action() {
    mount(Root, {
      content: () => <NotFoundPage />,
    });
  },
};
