import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import Store from '../../api/redux/client/store.js';
import AppContainer from './app-container';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
/**
* @summary Top-most component in charge of passing down store as a context for
* the whole app.
*/
const Root = ({ content }) => (
  <Provider store={Store}>
    <AppContainer content={content} />
  </Provider>
);

Root.propTypes = {
  content: PropTypes.func.isRequired, // component to be displayed, ex. <FeedPageContainer />
};

export default Root;
