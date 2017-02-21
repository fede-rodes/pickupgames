import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'underscore';
// import { check } from 'meteor/check';
// import { FlowRouter } from 'meteor/kadira:flow-router';
import { Bert } from 'meteor/themeteorchef:bert';
import Actions from '../../../api/redux/client/actions.js';
import Markers from '../../../api/markers/namespace.js';
import '../../../api/markers/api.js'; // Markers.api
import '../../../api/markers/collection.js'; // Markers.collection
import NotFoundPage from '../not-found-page.jsx';
import LoadingPage from '../loading-page.jsx';
// import AuxFunctions from '../../../api/aux-functions.js';
// import Constants from '../../../api/constants.js';
import MarkerMobile from './marker-mobile.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class MarkerPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleJoinUnjoinButtonClick = this.handleJoinUnjoinButtonClick.bind(this);
  }

  handleJoinUnjoinButtonClick() {
    const { reduxState, reduxActions, urlState, meteorData } = this.props;
    const { markerId } = urlState;

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmit', false);

    Meteor.call('Markers.methods.joinUnjoin', markerId, (err1) => {
      if (err1) {
        Bert.alert(err1.reason, 'danger', 'growl-top-right');
        // Re-enable submit button
        reduxActions.dispatchSetBooleanField('canSubmit', true);
      } else {
        Meteor.call('Users.methods.attachMarkerToUser', markerId, 'join-unjoin', (err2) => {
          if (err2) {
            Bert.alert(err2.reason, 'danger', 'growl-top-right');
          }
          // Re-enable submit button
          reduxActions.dispatchSetBooleanField('canSubmit', true);
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
      <MarkerMobile
        // pass data down
        reduxState={reduxState}
        meteorData={meteorData}
        // pass methods down
        handleJoinUnjoinButtonClick={this.handleJoinUnjoinButtonClick}
      />
    );
  }
}

MarkerPage.propTypes = {
  reduxState: PropTypes.shape({
    errors: PropTypes.shape({
      joinUnjoin: PropTypes.array,
    }).isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  urlState: PropTypes.shape({
    markerId: PropTypes.string.isRequired,
  }).isRequired,
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    markerReady: PropTypes.bool.isRequired,
    marker: PropTypes.shape({
      _id: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
      createdBy: PropTypes.string,
      createdByName: PropTypes.string,
      createdByAvatar: PropTypes.string,
      sport: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      date: PropTypes.instanceOf(Date),
      time: PropTypes.instanceOf(Date),
      location: PropTypes.object,
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
  }).isRequired,
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'marker';

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
const MarkerPageContainer = createContainer(({ markerId }) => {
  // Subscribe to both marker data + participant names
  const subs1 = Meteor.subscribe('Markers.publications.getMarkerForMarkerPage', markerId);
  const marker = Markers.collection.findOne({ _id: markerId });

  // Extend marker object
  if (subs1.ready() && marker) {
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

  return {
    urlState: {
      markerId,
    },
    meteorData: {
      curUserId: Meteor.userId(), // could be undefined
      markerReady: subs1.ready(),
      marker,
    },
  };
}, connect(mapStateToProps, mapDispatchToProps)(MarkerPage));

export default MarkerPageContainer;
