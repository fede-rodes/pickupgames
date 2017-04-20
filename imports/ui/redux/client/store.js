// NOT USED

/* import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
// import ReduxThunk from 'redux-thunk';
import rootReducer from './root-reducer.js';
import DevTools from './dev-tools.js';

const logger = createLogger();

const enhancers = [
  // applyMiddleware(ReduxThunk, logger),
  DevTools.instrument(),
];

// A Redux Store has 3 methods:
// 1. store.getState() -> returns the current state
// 2. store.dispatch({type: 'SAY_HELLO', message: 'HAI'});
// We won't use this really. We have other means for reactivity.
// 3. store.subscribe(someFunction);
const Store = createStore(rootReducer, {}, compose(...enhancers));

export default Store; */
