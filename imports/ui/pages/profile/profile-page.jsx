import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'underscore';
import { check } from 'meteor/check';
// import { FlowRouter } from 'meteor/kadira:flow-router';
import { Bert } from 'meteor/themeteorchef:bert';
import Markers from '../../../api/markers/namespace.js';
import '../../../api/markers/api.js'; // Markers.api
import '../../../api/markers/collection.js'; // Markers.collection
import PostsSystem from '../../../api/posts-system/namespace.js';
import '../../../api/posts-system/api.js'; // PostsSystem.api
import '../../../api/posts-system/collection.js'; // PostsSystem.collection
import NotFoundPage from '../not-found-page.jsx';
import LoadingPage from '../loading-page.jsx';
// import AuxFunctions from '../../../api/aux-functions.js';
// import LocalState from '../../../api/local-state/client/api.js';
// import Constants from '../../../api/constants.js';
import ProfileMobile from './profile-mobile.jsx';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* LocalState.set() must be used here and can't be used in any child component!
*/
class ProfilePage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleMarkerLinkClick = this.handleMarkerLinkClick.bind(this);
  }

  handleMarkerLinkClick(markerId) {
    // FlowRouter.go(`/marker/${markerId}`);
  }

  render() {
    const { markersReady } = this.props;

    if (!markersReady) {
      return <LoadingPage />;
    }
    return (
      <ProfileMobile
        {...this.props}
        handleMarkerLinkClick={this.handleMarkerLinkClick}
      />
    );
  }
}

ProfilePage.propTypes = {
  markersReady: PropTypes.bool.isRequired,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      markerType: PropTypes.array,
      title: PropTypes.string,
      description: PropTypes.string,
      location: PropTypes.object,
    })
  ), // not required, data might not be ready
};
//------------------------------------------------------------------------------
// PAGE CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Meteor reactivity
* (component-level subscriptions etc etc), and pass data down to 'Page'
* component. Warning, LocalState.set() can't be used here!
*/
const ProfilePageContainer = createContainer(() => {
  const curUserId = Meteor.userId();

  // Subscribe to current user markers. (The following data is always ready,
  // see layouts app-container).
  const curUser = Meteor.users.findOne({ _id: curUserId });
  const { createdMarkers, joinedMarkers } = curUser;
  const markerIds = _.union(createdMarkers, joinedMarkers);
  const subs = Meteor.subscribe('Markers.publications.getMarkersForProfile', markerIds);

  // Extend markers by adding markerType field ('created', 'joined')
  const markers = Markers.collection.find({ _id: { $in: markerIds } }).map((marker) => {
    const markerType = [];
    if (_.indexOf(createdMarkers, marker._id) !== -1) {
      markerType.push('created');
    }
    if (_.indexOf(joinedMarkers, marker._id) !== -1) {
      markerType.push('joined');
    }
    return _.extend(marker, { markerType });
  });

  return {
    markers,
    markersReady: subs.ready(),
  };
}, ProfilePage);

export default ProfilePageContainer;
