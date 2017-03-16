import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import Store from '../../api/redux/client/store.js';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
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
    <LocaleProvider locale={enUS}>
      <AppContainer content={content} />
    </LocaleProvider>
  </Provider>
);

Root.propTypes = {
  content: PropTypes.func.isRequired, // component to be displayed, ex. <FeedPageContainer />
};

export default Root;
