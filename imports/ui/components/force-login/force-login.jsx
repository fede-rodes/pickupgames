import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Actions from '../../../api/redux/client/actions.js';
// import { Bert } from 'meteor/themeteorchef:bert';
// import Users from '../../../api/users/namespace.js';
// import '../../../api/users/api.js'; // Users.api
/* import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'; */
// import { UserNotLoggedInModalContent } from '../components/force-login-email-verified/user-not-logged-in-modal-content.jsx';

//------------------------------------------------------------------------------
// COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the component's logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class ForceLogin extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleBackDropClick = this.handleBackDropClick.bind(this);
  }

  handleBackDropClick() {
    const { reduxActions } = this.props;
    reduxActions.dispatchSetBooleanField('isOpen', true);
  }

  render() {
    const { children, reduxState, meteorData } = this.props;
    const { isOpen } = reduxState;
    const { curUserId } = meteorData;

    const overlayClass = (!isOpen && !curUserId) ? 'overlay' : '';

    return (
      <div className="force-login-component">
        <div
          className={overlayClass}
          onClick={this.handleBackDropClick}
        />
        {children}
      </div>
    );
  }
}

ForceLogin.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  reduxState: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
  }).isRequired,
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'ForceLogin' component to handle UI State (Redux)
* integration.
*/
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
// CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'ForceLogin'component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'ForceLogin' component.
*/
const ForceLoginContainer = createContainer(({ children }) => {
  // All the data about the user is ready at this stage, check layouts/app-container.jsx
  return {
    children,
    meteorData: {
      curUserId: Meteor.userId(),
    },
  };
}, connect(mapStateToProps, mapDispatchToProps)(ForceLogin));

export default ForceLoginContainer;
