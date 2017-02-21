import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import _ from 'underscore';
// import Constants from '../../../api/constants.js';
import UrlHelpers from '../../../api/url-helpers.js';
import Actions from '../../../api/redux/client/actions.js';
import HomeMobile from './home-mobile.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class HomePage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleLocationOptionSelect = this.handleLocationOptionSelect.bind(this);
  }

  componentWillMount() {
    // Redirect user to feed page if logged in
    const { meteorData } = this.props;
    const { loggingIn, loggedIn } = meteorData;

    if (loggingIn || loggedIn) {
      FlowRouter.go('feed');
    }
  }

  handleSearchTextChange({ value }) {
    // Update search text field and clear errors if any
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateTextField('searchText', value);

    // Clear errors if any
    if (errors.searchText.length > 0) {
      reduxActions.dispatchClearErrors('searchText');
    }
  }

  handleLocationOptionSelect(selectedLocation) {
    // selectedLocation = { placeId, description, center }
    // Redirect user to feed page once option is selected. Previously, update
    // input text and clear errors if any.
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateTextField('searchText', selectedLocation.description);

    // Clear errors if any
    if (errors.searchText.length > 0) {
      reduxActions.dispatchClearErrors('searchText');
    }

    const { params, queryParams } = UrlHelpers.genRouteParams('list', 'place', selectedLocation);
    FlowRouter.go('feed', params, queryParams);
  }

  render() {
    const { reduxState, meteorData } = this.props;

    return (
      <HomeMobile
        // pass data down
        reduxState={reduxState}
        // meteorData={meteorData}
        // pass methods down
        handleSearchTextChange={this.handleSearchTextChange}
        handleLocationOptionSelect={this.handleLocationOptionSelect}
      />
    );
  }
}

HomePage.propTypes = {
  reduxState: PropTypes.shape({
    searchText: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  meteorData: PropTypes.shape({
    loggingIn: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
  }).isRequired,
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'home';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page. TODO: use functional programming
  // (redux helper?) for binding namespace to actions.
  const reduxActions = {
    dispatchUpdateTextField(fieldName, value) {
      return dispatch(Actions.updateTextField(namespace, fieldName, value));
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
// PAGE CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const HomePageContainer = createContainer(() => {
  // Meteor subscriptions go here
  return {
    meteorData: {
      loggingIn: !!Meteor.loggingIn(),
      loggedIn: !!Meteor.user(),
    },
  };
}, connect(mapStateToProps, mapDispatchToProps)(HomePage));

export default HomePageContainer;
