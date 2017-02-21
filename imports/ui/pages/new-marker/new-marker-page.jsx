import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'underscore';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Bert } from 'meteor/themeteorchef:bert';
// import Snackbar from 'material-ui/Snackbar';
import Actions from '../../../api/redux/client/actions.js';
import Markers from '../../../api/markers/namespace.js';
import '../../../api/markers/api.js'; // Markers.api
import AuxFunctions from '../../../api/aux-functions.js';
import Constants from '../../../api/constants.js';
import NewMarkerMobile from './new-marker-mobile.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class NewMarkerPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
    this.handleLocationOptionSelect = this.handleLocationOptionSelect.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormInputChange({ fieldName, value }) {
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    // Update redux state
    switch (fieldName) {
      case 'maxParticipants':
        reduxActions.dispatchSetNumericField(fieldName, parseInt(value, 10));
        break;
      case 'date':
      case 'time':
        reduxActions.dispatchSetDateField(fieldName, value);
        break;
      default:
        reduxActions.dispatchUpdateTextField(fieldName, value);
        break;
    }

    // Clear errors for the field being modified
    if (errors[fieldName].length > 0) {
      reduxActions.dispatchClearErrors(fieldName);
    }
  }

  handleLocationOptionSelect(selectedLocation) {
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateSelectedLocation(selectedLocation);
    reduxActions.dispatchUpdateTextField('address', selectedLocation.description);

    // Clear errors for the field being modified
    if (errors.address.length > 0) {
      reduxActions.dispatchClearErrors('address');
    }
  }

  handleFormSubmit(e) {
    e.nativeEvent.preventDefault();
    const { reduxState, reduxActions } = this.props;
    const formFields = [
      'sport',
      'title',
      'description',
      'date',
      'time',
      'address',
      'selectedLocation',
      'maxParticipants',
      'cost',
    ];

    // Clear errors if any
    reduxActions.dispatchClearErrors(formFields);

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmit', false);

    // Get new marker fields from redux state
    const newMarker = _.pick(reduxState, formFields);

    // Check for errors
    const errors = Markers.api.checkNewMarkerFields(newMarker);

    // In case of errors, warn user and prevent the meteor method to be called
    if (AuxFunctions.hasErrors(errors)) {
      reduxActions.dispatchSetErrors(errors);
      // TODO: Scroll to first error field
      // const errorKey = AuxFunctions.getFirstError(errors).key;
      // const elemYOffset = $(`#${elem}`).offset().top;
      // const elemYOffset = document.getElementById(elem).scrollTop;
      // console.log('elemYOffset', elemYOffset);
      // window.scrollTo(0, elemYOffset - 100);
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmit', true);
      return;
    }

    Meteor.call('Markers.methods.createMarker', newMarker, (err1, markerId) => {
      if (err1) {
        Bert.alert(err1.reason, 'danger', 'growl-top-right');
        // Re-enable submit button
        reduxActions.dispatchSetBooleanField('canSubmit', true);
      } else {
        Meteor.call('Users.methods.attachMarkerToUser', markerId, 'new', (err2) => {
          if (err2) {
            Bert.alert(err2.reason, 'danger', 'growl-top-right');
            // Re-enable submit button
            reduxActions.dispatchSetBooleanField('canSubmit', true);
          } else {
            Bert.alert('Activity create successfully!', 'success', 'growl-top-right');
            FlowRouter.go('marker', { markerId });
          }
        });
      }
    });
  }

  render() {
    const { reduxState } = this.props;

    return (
      <NewMarkerMobile
        // pass data down
        reduxState={reduxState}
        // pass methods down
        handleFormInputChange={this.handleFormInputChange}
        handleLocationOptionSelect={this.handleLocationOptionSelect}
        handleFormSubmit={this.handleFormSubmit}
      />
    );
  }
}

NewMarkerPage.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    sport: PropTypes.oneOf([...Constants.MARKER_SPORTS_ARRAY, '']),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    time: PropTypes.instanceOf(Date),
    address: PropTypes.string.isRequired,
    selectedLocation: PropTypes.shape({
      placeId: PropTypes.string,
      description: PropTypes.string,
      coordinates: PropTypes.object,
    }).isRequired,
    maxParticipants: PropTypes.number,
    cost: PropTypes.string,
    errors: PropTypes.shape({
      sport: PropTypes.array.isRequired,
      title: PropTypes.array.isRequired,
      description: PropTypes.array,
      date: PropTypes.array.isRequired,
      time: PropTypes.array.isRequired,
      address: PropTypes.array.isRequired,
      cost: PropTypes.array.isRequired,
      maxParticipants: PropTypes.array.isRequired,
    }).isRequired,
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
const namespace = 'newMarker';

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
    dispatchSetNumericField(fieldName, value) {
      return dispatch(Actions.setNumericField(namespace, fieldName, value));
    },
    dispatchSetDateField(fieldName, value) {
      return dispatch(Actions.setDateField(namespace, fieldName, value));
    },
    dispatchSetBooleanField(fieldName, value) {
      return dispatch(Actions.setBooleanField(namespace, fieldName, value));
    },
    dispatchUpdateSelectedLocation(data) {
      return dispatch(Actions.updateSelectedLocation(namespace, data));
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
const NewMarkerPageContainer = createContainer(() => {
  // Subscriptions go here!
  return {};
}, connect(mapStateToProps, mapDispatchToProps)(NewMarkerPage));

export default NewMarkerPageContainer;
