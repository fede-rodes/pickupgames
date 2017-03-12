import { combineReducers } from 'redux';
import loginPageReducer from './reducers/login-page-reducer.js';
import homePageReducer from './reducers/home-page-reducer.js';
import feedPageReducer from './reducers/feed-page-reducer.js';
import newMarkerPageReducer from './reducers/new-marker-page-reducer.js';
import markerPageReducer from './reducers/marker-page-reducer.js';
import postsSystemReducer from './reducers/posts-system-reducer.js';

const rootReducer = combineReducers({
  login: loginPageReducer,
  home: homePageReducer,
  feed: feedPageReducer,
  newMarker: newMarkerPageReducer,
  marker: markerPageReducer,
  postsSystem: postsSystemReducer,
});

export default rootReducer;
