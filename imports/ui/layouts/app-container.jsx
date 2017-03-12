import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'underscore';
import LoadingPage from '../pages/loading-page.jsx';
import LoginPage from '../pages/login/login-page.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
/**
* @summary Second top-most component acting as a general controller for the whole app.
* It takes care of global subscriptions (displaying a loading indicator when
* global subscriptions aren't ready) + handles authentication (and roles).
* @see {@link https://themeteorchef.com/snippets/authentication-with-react-and-flow-router/}
*/
const App = ({ content, meteorData }) => {
  const { subsReady, loggingIn, loggedIn } = meteorData;

  // Handle loading indicator
  if (!subsReady || loggingIn) return <LoadingPage />;

  // Render login page if user is not authenticated
  if (!loggedIn) return <LoginPage />;

  // Otherwise, render requested page
  return content();
};

App.propTypes = {
  content: PropTypes.func.isRequired, // component to be displayed, ex. <FeedPageContainer />
  meteorData: PropTypes.shape({
    loggingIn: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    subsReady: PropTypes.bool.isRequired,
  }).isRequired,
};
//------------------------------------------------------------------------------
/**
* @summary Container wrapper around App to handle Meteor reactive data.
* @see {@link https://themeteorchef.com/snippets/authentication-with-react-and-flow-router/}
*/
const AppContainer = createContainer(({ content }) => {
  // Global subsriptions
  const handles = [
    Meteor.subscribe('Users.publications.curUser'),
  ];

  // Are all subsriptions ready?
  const subsReady = _.every(handles, handle => handle.ready()); // bool

  // Populate App component props
  return {
    content,
    meteorData: {
      loggingIn: !!Meteor.loggingIn(),
      loggedIn: !!Meteor.user(),
      subsReady,
    },
  };
}, App);

export default AppContainer;





/*
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
// import { FlowRouter } from 'meteor/kadira:flow-router';
import _ from 'underscore';
import { Modal, Button } from 'antd';
import Actions from '../../api/redux/client/actions.js';
import LoadingPage from '../pages/loading-page.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
/**
* @summary Top-most component acting as a general controller for the whole app.
* It takes care of global subscriptions (displaying a loading indicator when
* global subscriptions aren't ready) + handles authentication (and roles).
* @see {@link https://themeteorchef.com/snippets/authentication-with-react-and-flow-router/}

class App extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleLoginModalCloseButtonClick = this.handleLoginModalCloseButtonClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleLoginModalCloseButtonClick() {
    const { reduxActions } = this.props;
    reduxActions.dispatchSetBooleanField('isOpen', false);
  }

  handleSubmit() {
    const { reduxActions } = this.props;

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmit', false);

    Meteor.loginWithFacebook({
      requestPermissions: ['user_friends', 'public_profile', 'email'],
    }, (err) => {
      if (err) {
        console.log(err);
        // Re-enable submit button
        reduxActions.dispatchSetBooleanField('canSubmit', true);
      } else {
        console.log('[login] success');
      }
    });
  }

  render() {
    const { content, reduxState, meteorData } = this.props;
    const { subsReady, loggingIn, loggedIn } = meteorData;
    const { isOpen, canSubmit } = reduxState;

    // Handle loading indicator
    return !subsReady || loggingIn ? <LoadingPage /> : (
      <div style={{ height: '100%' }}>
        <Modal
          wrapClassName="vertical-center-modal"
          visible={isOpen}
          onCancel={this.handleLoginModalCloseButtonClick}
          footer=""
        >
          <Button
            onClick={this.handleSubmit}
            disabled={!canSubmit}
            loading={!canSubmit}
          >
            Log in with facebook
          </Button>
        </Modal>
        {content()}
      </div>
    );
  }
}

App.propTypes = {
  content: PropTypes.func.isRequired, // component to be displayed, ex. <FeedPageContainer />
  reduxState: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    canSubmit: PropTypes.bool.isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  meteorData: PropTypes.shape({
    loggingIn: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    subsReady: PropTypes.bool.isRequired,
  }).isRequired,
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.

const namespace = 'login';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page. TODO: use functional programming
  // (redux helper?) for binding namespace to actions.
  const reduxActions = {
    dispatchSetBooleanField(fieldName, value) {
      return dispatch(Actions.setBooleanField(namespace, fieldName, value));
    },
    dispatchSetErrors(errorsObj) {
      return dispatch(Actions.setErrors(namespace, errorsObj));
    },
    dispatchClearErrors(fieldName) {
      return dispatch(Actions.clearErrors(namespace, fieldName));
    },
  };

  return { reduxActions };
}

//------------------------------------------------------------------------------
/**
* @summary Container wrapper around App to handle Meteor reactive data.
* @see {@link https://themeteorchef.com/snippets/authentication-with-react-and-flow-router/}

const AppContainer = createContainer(({ content }) => {
  // Global subsriptions (if any)
  const handles = [
    Meteor.subscribe('Users.publications.curUser'),
  ];

  // Are all subsriptions ready?
  const subsReady = _.every(handles, handle => handle.ready()); // bool

  // Populate App component props
  return {
    content,
    meteorData: {
      loggingIn: !!Meteor.loggingIn(),
      loggedIn: !!Meteor.user(),
      subsReady,
    },
  };
}, connect(mapStateToProps, mapDispatchToProps)(App));

export default AppContainer;

*/
