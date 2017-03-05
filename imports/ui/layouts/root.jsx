import React, { PropTypes } from 'react';
// import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from '../../api/redux/client/store.js';
import AppContainer from './app-container';

const Root = ({ content }) => (
  <Provider store={Store}>
    <AppContainer content={content} />
  </Provider>
);

Root.propTypes = {
  content: PropTypes.func.isRequired, // component to be displayed, ex. <FeedPageContainer />
};

export default Root;
