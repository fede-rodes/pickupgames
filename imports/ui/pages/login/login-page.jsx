import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Actions from '../../../api/redux/client/actions.js';
import HomeMobile from './login-mobile.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class LoginPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { reduxActions } = this.props;

    // Clear errors if any
    reduxActions.dispatchClearErrors('auth');

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmit', false);

    Meteor.loginWithFacebook({
      requestPermissions: ['user_friends', 'public_profile', 'email'],
    }, (err) => {
      if (err) {
        // Display errors on UI
        reduxActions.dispatchSetErrors({ auth: err.reason || 'something went wrong' });

        // Re-enable submit button
        reduxActions.dispatchSetBooleanField('canSubmit', true);
      } else {
        console.log('[login] success');
      }
    });
  }

  render() {
    const { reduxState } = this.props;

    return (
      <HomeMobile
        // Pass data down
        reduxState={reduxState}
        // Pass methods down
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

LoginPage.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'login';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page (namespace).
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
