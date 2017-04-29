import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
// import { FlowRouter } from 'meteor/kadira:flow-router';
import _ from 'underscore';
import { check, Match } from 'meteor/check';
import { Counts } from 'meteor/tmeasday:publish-counts';
import UrlHelpers from '../../../api/url-helpers.js';
import Actions from '../../../api/redux/client/actions.js';
import AuxFunctions from '../../../api/aux-functions.js';
import GoogleMaps from '../../../api/google-maps/namespace.js';
import '../../../api/aux-functions.js'; // GoogleMaps.api
import PostsSystem from '../../../api/posts-system/namespace.js';
import '../../../api/posts-system/api.js'; // PostsSystem.api
import '../../../api/posts-system/collection.js'; // PostsSystem.collection
import Constants from '../../../api/constants.js';
import Users from '../../../api/users/namespace.js';
import '../../../api/users/api.js'; // Users.api
import LoadingPage from '../loading-page.jsx';
import Markers from '../../../api/markers/namespace.js';
import '../../../api/markers/api.js'; // Markers.api
import '../../../api/markers/collection.js'; // Markers.collection
import FeedListMobile from './feed-list-mobile.jsx';
import FeedMapMobile from './feed-map-mobile.jsx';

//------------------------------------------------------------------------------
// GLOBAL VARS:
//------------------------------------------------------------------------------
let synced = true;
//------------------------------------------------------------------------------
// AUX FUNCTIONS:
//------------------------------------------------------------------------------
function syncUiState(urlState, reduxActions) {
  check(urlState, {
    view: Match.OneOf('list', 'map'),
    searchType: Match.OneOf('place', 'mapBounds'),
    place: Match.OneOf({
      placeId: String,
      description: String, // TODO: change name to 'address'
      center: Object,
      radius: Number,
    }, {}),
    mapBounds: Match.OneOf({
      southWest: {
        lat: Number,
        lng: Number,
      },
      northEast: {
        lat: Number,
        lng: Number,
      },
      center: {
        lat: Number,
        lng: Number,
      },
    }, {}),
    zoom: Number,
    pageNumber: Number,
  });

  const { view, searchType, place, mapBounds, zoom } = urlState;

  // Dispatch actions to update redux state based on current url
  reduxActions.dispatchChangeView(view);
  reduxActions.dispatchHideRecalculateMarkersButton();
  if (searchType === 'place' && !_.isEmpty(place)) {
    reduxActions.dispatchChangeSearchType('place');
    reduxActions.dispatchUpdatePlace(place);
    reduxActions.dispatchUpdateTextField('searchText', place.description);
    reduxActions.dispatchClearMapBounds(); // clear the opposite searchType
    reduxActions.dispatchSetNumericField('zoom', zoom);
  } else if (searchType === 'mapBounds' && !_.isEmpty(mapBounds)) {
    const { southWest, northEast, center } = mapBounds;
    reduxActions.dispatchChangeSearchType('mapBounds');
    reduxActions.dispatchUpdateMapBounds(southWest, northEast, center);
    reduxActions.dispatchUpdateTextField('searchText', '(map search)');
    reduxActions.dispatchClearPlace(); // clear the opposite searchType
    reduxActions.dispatchSetNumericField('zoom', zoom);
  } else {
    reduxActions.dispatchUpdateTextField('searchText', '');
    reduxActions.dispatchClearPlace();
    reduxActions.dispatchClearMapBounds();
  }
}
//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class FeedPage extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handlePlaceChange = this.handlePlaceChange.bind(this);
    this.handleMapPan = this.handleMapPan.bind(this);
    this.handleRedoSearchHereButtonClick = this.handleRedoSearchHereButtonClick.bind(this);
    this.handleNewMarkerButtonClick = this.handleNewMarkerButtonClick.bind(this);
    this.handleMarkerCardClick = this.handleMarkerCardClick.bind(this);
    this.handlePageLimitReached = this.handlePageLimitReached.bind(this);
  }

  componentDidMount() {
    const { urlState, meteorData, reduxState, reduxActions } = this.props;
    const { curUser } = meteorData;

    // Initialize redux store based on the current url data (url might be empty).
    syncUiState(urlState, reduxActions);

    // In case url is empty...
    if (_.isEmpty(urlState.place) && _.isEmpty(urlState.mapBounds)) {

      // ... set default search value based redux store or...
      if (!_.isEmpty(reduxState.place)) {
        const { params, queryParams } = UrlHelpers.genRouteParams('list', 'place', reduxState.place);
        // FlowRouter.go('feed', params, queryParams);
      } else if (!_.isEmpty(reduxState.mapBounds) && _.isNumber(reduxState.zoom)) {
        const { params, queryParams } = UrlHelpers.genRouteParams('list', 'mapBounds', { ...reduxState.mapBounds, zoom: reduxState.zoom });
        // FlowRouter.go('feed', params, queryParams);
      }

      // ... if redux state is empty, using the search value stored in the
      // user's doc. Obs: curUser.searchValue is {} by default
      else if (curUser && !_.isEmpty(curUser.searchValue)) {
        const formattedUser = Users.api.formatUser(curUser);
        const { place, map } = formattedUser.searchValue;
        if (!_.isEmpty(place)) {
          const { params, queryParams } = UrlHelpers.genRouteParams('list', 'place', place);
          // FlowRouter.go('feed', params, queryParams);
        } else if (!_.isEmpty(map)) {
          const { params, queryParams } = UrlHelpers.genRouteParams('list', 'mapBounds', map);
          // FlowRouter.go('feed', params, queryParams);
        } else {
          throw new Error('curUser.searchValue missing at FeedPage.componentDidMount');
        }
      }
    }

    // In case the url is NOT empty (either urlState.place or urlState.mapBounds
    // is not empty) save search value into user's doc...
    else {
      // TODO: avoid calling updateSearchValue method if current url search
      // value equals the user's current search value:
      // && curUser.searchValue !== urlState.'searchValue' instead of
      // _.isEmpty(curUser.searchValue)
      if (curUser && _.isEmpty(curUser.searchValue)) {
        Meteor.call('Users.methods.updateSearchValue', urlState);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { urlState, reduxActions } = this.props;
    const { urlState: nextUrlState, meteorData: nextMeteorData } = nextProps;
    const { curUser: nextCurUser } = nextMeteorData;

    // Update redux store everytime the url changes. Additionally, update user's
    // profile in order to store the latest used search value.
    if (!_.isEqual(urlState, nextUrlState)) {
      syncUiState(nextUrlState, reduxActions);
      if (nextCurUser) {
        Meteor.call('Users.methods.updateSearchValue', nextUrlState);
      }
    }

    return true;
  }

  handleViewChange(view) {
    // The user clicks the button at the bottom of the page in order to change
    // the view type (from 'list' to 'map' or viceversa). Every time this
    // happens update the url to trigger the view change.
    // FlowRouter.setParams({ view });
  }

  handleSearchTextChange({ fieldName, value }) {
    // The user types on the search box at the top of the page.
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateTextField(fieldName, value);

    // Clear errors if any
    /* if (errors.location.length > 0) {
      reduxActions.dispatchClearErrors('location'); // TODO: 'place' instead of 'location'?
    } */
  }

  handlePlaceChange({ placeId, description, center, radius }) { // selectedPlace
    // The user chose a google place from the search form at the top of
    // the page or, alternatively, changed the radio value using the slider.
    // Every time this happens, update the url in order to trigger a
    // re-subscription in the list of results.
    if (!_.isUndefined(description)) {
      const { params, queryParams } = UrlHelpers.genRouteParams('list', 'place', { placeId, description, center });
      // FlowRouter.go('feed', params, queryParams);
    } else if (!_.isUndefined(radius)) {
      // FlowRouter.setQueryParams({ radius });
    }
  }

  handleMapPan({ southWest, northEast, center, zoom }) {
    // The user is interacting with the map (panning, zooming in/out). In
    // case the current map bounds (or zoom) differs from the values stored in
    // the url, DISPLAY a 'Redo search here' button that will be used in the
    // future to calculate results within the new region. Additionally, for
    // every call of the handleMapPan function, save the new map bounds and zoom
    // value in the redux store but do not update url. Url will only be updated
    // with the new map bounds and zoom when the user clicks on the 'Redo
    // search here' button.
    const { reduxActions } = this.props;
    reduxActions.dispatchCheckRecalculateMarkersButtonDisplayState(center, zoom);
    reduxActions.dispatchUpdateMapBounds(southWest, northEast, center);
    reduxActions.dispatchSetNumericField('zoom', zoom);
  }

  handleRedoSearchHereButtonClick() {
    // The user clicks on the 'Redo search here' button at the top of the 'map'
    // view. Every time this happens, grab the last map bounds and zoom values
    // from the redux store and update the url to trigger a re- subscriptions
    // in the list of results.
    const { mapBounds, zoom } = this.props.reduxState;
    const { params, queryParams } = UrlHelpers.genRouteParams('map', 'mapBounds', { ...mapBounds, zoom });
    // FlowRouter.go('feed', params, queryParams);
  }

  handleNewMarkerButtonClick() {
    // FlowRouter.go('new-marker');
  }

  handleMarkerCardClick(markerId) {
    // FlowRouter.go('marker', { markerId });
  }

  handlePageLimitReached() {
    console.log('handlePageLimitReached');
    // The user reached the bottom of the page. Increase the page number to fire
    // a new subscriptions.
    const prevPageNumber = this.props.urlState.pageNumber;
    console.log('prevPageNumber', prevPageNumber);
    // FlowRouter.setQueryParams({ pageNumber: prevPageNumber + 1 });
  }

  render() {
    // Do not render view until the url (urlState) and the redux store (reduxState)
    // are synced for the first time. Then, keep rendering even though states
    // differ. urlState = { view, searchType, place, mapBounds, zoom }
    const { urlState, reduxState, meteorData } = this.props;

    if (synced && !_.isEqual(urlState, _.pick(reduxState, 'view', 'searchType', 'place', 'mapBounds', 'zoom'))) {
      synced = false;
      return <LoadingPage />;
    }

    const { view } = reduxState; // view = 'list', 'map'
    const ViewMobile = view === 'list' ? FeedListMobile : FeedMapMobile;

    return (
      <div>
        :) hola
      </div>
    );

  /* return (
    <ViewMobile
      // pass data down
      reduxState={reduxState}
      meteorData={meteorData}
      // pass methods down
      handleViewChange={this.handleViewChange}
      handleSearchTextChange={this.handleSearchTextChange}
      handlePlaceChange={this.handlePlaceChange}
      handleMapPan={this.handleMapPan}
      handleRedoSearchHereButtonClick={this.handleRedoSearchHereButtonClick}
      handleNewMarkerButtonClick={this.handleNewMarkerButtonClick}
      handleMarkerCardClick={this.handleMarkerCardClick}
      handlePageLimitReached={this.handlePageLimitReached}
    />
  ); */
  }
}

FeedPage.propTypes = {
  reduxState: PropTypes.shape({
    view: PropTypes.oneOf(['list', 'map']),
    searchType: PropTypes.oneOf(['place', 'mapBounds']).isRequired,
    pageNumber: PropTypes.number.isRequired,
    searchText: PropTypes.string.isRequired,
    place: PropTypes.shape({
      placeId: PropTypes.string,
      description: PropTypes.string,
      center: PropTypes.object,
      radius: PropTypes.number,
    }).isRequired,
    mapBounds: PropTypes.shape({
      southWest: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
      northEast: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
      center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    }).isRequired,
    zoom: PropTypes.number.isRequired,
    showRecalculateMarkersButton: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  urlState: PropTypes.shape({
    view: PropTypes.oneOf(['list', 'map']).isRequired,
    searchType: PropTypes.oneOf(['place', 'mapBounds']).isRequired,
    place: PropTypes.shape({
      placeId: PropTypes.string,
      description: PropTypes.string,
      center: PropTypes.object,
      radius: PropTypes.number,
    }).isRequired,
    mapBounds: PropTypes.shape({
      southWest: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
      northEast: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
      center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    }).isRequired,
    zoom: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
  }).isRequired,
  meteorData: PropTypes.shape({
    curUser: PropTypes.object,
    markersReady: PropTypes.bool.isRequired,
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        createdAt: PropTypes.instanceOf(Date),
        createdBy: PropTypes.string,
        createdByName: PropTypes.string,
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
            joinedAt: PropTypes.instanceOf(Date),
            name: PropTypes.string,
            avatar: PropTypes.string,
          }).isRequired
        ),
        // numPosts: PropTypes.number,
      })
    ).isRequired,
    numLoadedMarkers: PropTypes.number.isRequired,
    numTotalMarkers: PropTypes.number.isRequired,
  }).isRequired,
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'feed';

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
    dispatchSetErrors(errorsObj) {
      return dispatch(Actions.setErrors(namespace, errorsObj));
    },
    dispatchClearErrors(fieldName) {
      return dispatch(Actions.clearErrors(namespace, fieldName));
    },
    dispatchUpdatePlace(data) {
      return dispatch(Actions.updatePlace(namespace, data));
    },
    dispatchUpdateMapBounds(southWest, northEast, center) {
      return dispatch(Actions.updateMapBounds(namespace, southWest, northEast, center));
    },
    dispatchClearPlace() {
      return dispatch(Actions.clearPlace(namespace));
    },
    dispatchClearMapBounds() {
      return dispatch(Actions.clearMapBounds(namespace));
    },
    dispatchChangeView(value) {
      return dispatch(Actions.changeView(namespace, value));
    },
    dispatchCheckRecalculateMarkersButtonDisplayState(center, zoom) {
      return dispatch(Actions.checkRecalculateMarkersButtonDisplayState(namespace, center, zoom));
    },
    dispatchChangeSearchType(value) {
      return dispatch(Actions.changeSearchType(namespace, value));
    },
    dispatchHideRecalculateMarkersButton() {
      return dispatch(Actions.hideRecalculateMarkersButton(namespace));
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
const FeedPageContainer = createContainer(({ params, queryParams }) => {
  const { view, searchType } = params;
  const { place, mapBounds } = UrlHelpers.getPlaceAndMapBounds(params, queryParams);
  const zoom = queryParams.zoom && parseInt(queryParams.zoom, 10) || Constants.FEED_DEFAULT_ZOOM;
  const pageNumber = queryParams.pageNumber && parseInt(queryParams.pageNumber, 10) || 1;

  // Query data (subscribe) based on url state
  const args = {
    searchType, // 'place', 'mapBounds'
    place, // { placeId, description, center (lat, lng), radius }
    mapBounds, // { southWest (lat, lng), northEast (lat, lng), center (lat, lng) }
    limit: pageNumber * Constants.FEED_RECORDS_PER_PAGE,
  };
  const subs1 = Meteor.subscribe('Markers.publications.getMarkersForFeedPage', args);
  const markers = Markers.collection.find({}, { sort: { date: 1, time: 1 } }).map(marker => {
    const participants = marker.participants;
    participants.map(p => {
      const participant = Meteor.users.findOne({ _id: p.userId });
      return _.extend(p, {
        name: participant && participant.profile.name || '',
        avatar: participant && participant.avatar || '',
      });
    });
    return _.extend(marker, participants);
  });
  const numLoadedMarkers = markers.length;
  const numTotalMarkers = Counts.get('Markers.publications.searchMarkersCount');

  return {
    urlState: {
      view,
      searchType,
      place,
      mapBounds,
      zoom,
      pageNumber,
    },
    meteorData: {
      curUser: Meteor.user(),
      markersReady: subs1.ready(),
      markers,
      numLoadedMarkers,
      numTotalMarkers,
    },
  };
}, connect(mapStateToProps, mapDispatchToProps)(FeedPage));

export default FeedPageContainer;
