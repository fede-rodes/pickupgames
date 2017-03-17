import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'underscore';
// import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Bert } from 'meteor/themeteorchef:bert';
import Actions from '../../../api/redux/client/actions.js';
import Markers from '../../../api/markers/namespace.js';
import '../../../api/markers/api.js'; // Markers.api
import AuxFunctions from '../../../api/aux-functions.js';
import NotFoundPage from '../not-found-page.jsx';
import LoadingPage from '../loading-page.jsx';
import Constants from '../../../api/constants.js';
import AdminMarkerMobile from './admin-marker-mobile.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class AdminMarkerPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
    this.handleLocationOptionSelect = this.handleLocationOptionSelect.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Initialize redux state data based marker data
    const { reduxActions, meteorData } = nextProps;

    if (!meteorData || !meteorData.markerReady) return;

    const {
      title,
      date,
      time,
      location,
      description,
      maxParticipants,
      cost,
      participants,
    } = meteorData;

    reduxActions.dispatchUpdateTextField('title', title || '');
    reduxActions.dispatchSetDateField('date', date || '');
    reduxActions.dispatchSetDateField('time', time || '');
    reduxActions.dispatchUpdateTextField('address', location && location.description || '');
    reduxActions.dispatchUpdateSelectedLocation('location', location || '');
    reduxActions.dispatchUpdateTextField('description', description || '');
    reduxActions.dispatchSetNumericField(maxParticipants, parseInt(maxParticipants, 10) || 0);
    reduxActions.dispatchUpdateTextField('cost', cost || '');
    // reduxActions.dispatchUpdateArrayField('participants', participants);
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
      // 'sport',
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
      // TODO: Scroll to first error field
      // const errorKey = AuxFunctions.getFirstError(errors).key;
      // const elemYOffset = $(`#${elem}`).offset().top;
      // const elemYOffset = document.getElementById(elem).scrollTop;
      // console.log('elemYOffset', elemYOffset);
      // window.scrollTo(0, elemYOffset - 100);
      // Display errors on UI
      reduxActions.dispatchSetErrors(errors);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmit', true);
      return;
    }

    Meteor.call('Markers.methods.updateMarker', newMarker, (err1, markerId) => {
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
    const { reduxState, meteorData } = this.props;
    const { markerReady, marker } = meteorData;

    if (!markerReady) {
      return <LoadingPage />;
    }
    if (!marker) {
      return <NotFoundPage />;
    }

    return (
      <AdminMarkerMobile
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

AdminMarkerPage.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    title: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    time: PropTypes.instanceOf(Date),
    address: PropTypes.string,
    location: PropTypes.object,
    description: PropTypes.string,
    maxParticipants: PropTypes.number,
    cost: PropTypes.string,
    // participants: PropTypes.array.isRequired,
    errors: PropTypes.shape({
      title: PropTypes.array,
      date: PropTypes.array,
      time: PropTypes.array,
      address: PropTypes.array,
      description: PropTypes.array,
      maxParticipants: PropTypes.array,
      cost: PropTypes.array,
      // participants: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  meteorData: PropTypes.shape({
    markerReady: PropTypes.bool.isRequired,
    marker: PropTypes.shape({
      _id: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
      createdBy: PropTypes.string,
      createdByName: PropTypes.string,
      createdByAvatar: PropTypes.string,
      sport: PropTypes.string,
      title: PropTypes.string,
      date: PropTypes.instanceOf(Date),
      time: PropTypes.instanceOf(Date),
      location: PropTypes.object,
      description: PropTypes.string,
      maxParticipants: PropTypes.number,
      cost: PropTypes.string,
      participants: PropTypes.arrayOf(
        PropTypes.shape({
          userId: PropTypes.string,
          userName: PropTypes.string,
          userAvatar: PropTypes.string,
          joinedAt: PropTypes.instanceOf(Date),
        })
      ),
    }), // not required!
  }),
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'adminMarker';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page (namespace).
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
const AdminMarkerPageContainer = createContainer(({ markerId }) => {
  // Verify marker id is set
  if (!markerId) {
    return {};
  }

  // Check current user is logged in
  const curUserId = Meteor.userId();
  const loggedIn = !!curUserId;

  if (!loggedIn) {
    return {};
  }

  // Subscribe to marker data
  const subs = Meteor.subscribe('Markers.publications.getMarkerForMarkerPage', markerId);
  const marker = Markers.collection.findOne({ _id: markerId });
  const markerReady = subs.ready();

  // Check current user is owner
  if (marker && curUserId !== marker.createdBy) {
    return {};
  }

  // Extend marker object
  if (markerReady && marker) {
    const { createdBy, participants } = marker;
    const author = Meteor.users.findOne({ _id: createdBy });
    _.extend(marker, {
      createdByName: author.profile.name,
      createdByAvatar: author.avatar,
      participants: participants.map((participant) => {
        const p = Meteor.users.findOne({ _id: participant.userId });
        return _.extend(participant, {
          userName: p.profile.name,
          userAvatar: p.avatar,
        });
      }),
    });
  }

  console.log(marker);

  return {
    meteorData: {
      markerReady,
      marker,
    },
  };
}, connect(mapStateToProps, mapDispatchToProps)(AdminMarkerPage));

export default AdminMarkerPageContainer;
