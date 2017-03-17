import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import _ from 'underscore';
import { Button, Icon } from 'antd';
import GoogleMaps from '../../../api/google-maps/namespace.js';
import '../../../api/google-maps/api.js'; // GoogleMaps.api
import DefaultLayout from '../../layouts/default/default-layout.jsx';
import styles from './styles.scss';
// import AuxFunctions from '../../../api/aux-functions.js';
// import Constants from '../../../api/constants.js';

//------------------------------------------------------------------------------
// AUX FUNCTIONS:
//------------------------------------------------------------------------------
function placeMarkers(searchType, markers) {
  // Remove previous marker if any
  GoogleMaps.api.clearMarkers();

  // Set markers on map
  _.each(markers, (marker) => {
    const { _id, location, sport, date, time, title } = marker;
    const coordinates = location.geometry.coordinates;
    const latLng = { lat: coordinates[1], lng: coordinates[0] };
    const heading = `${sport}, ${moment.utc(date).format('ddd MMM Do YYYY')}, ${moment.utc(time).format('HH:mm')}h`;
    const content = (
      `<a className="block" href="/marker/${_id}">
        <h4>${title}</h4>
        <div className="mt2">
          <p>
            ${moment.utc(date).format('ddd, MMM Do YYYY')}
            &nbsp;-&nbsp;
            ${moment.utc(time).format('HH:mm')}h
          </p>
        </div>
      </a>`
    );
    GoogleMaps.api.addMarker(latLng, heading, content);
  });
}
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class FeedMapMobile extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { reduxState, meteorData, handleMapPan } = this.props;
    const { searchType, place, mapBounds, zoom } = reduxState;
    const { markers } = meteorData;

    // Check args
    if ((searchType !== 'place' && searchType !== 'mapBounds') ||
        (_.isEmpty(place) && _.isEmpty(mapBounds))) {
      throw new Error('wrong args at FeedMapMobile');
    }

    const center = reduxState[searchType].center; // place.center || mapBounds.center
    GoogleMaps.api.init('js-feed-map', center, zoom);
    GoogleMaps.api.addEventListenerIdle(handleMapPan);
    placeMarkers(searchType, markers);
  }

  componentWillReceiveProps(nextProps) {
    const { reduxState, meteorData } = nextProps;
    placeMarkers(reduxState.searchType, meteorData.markers);
    return true;
  }

  render() {
    const {
      reduxState,
      handleViewChange,
      handleRedoSearchHereButtonClick,
      handleNewMarkerButtonClick,
    } = this.props;

    return (
      <DefaultLayout withoutFooter padding="0">
        {reduxState.showRecalculateMarkersButton && (
          <Button
            type="primary"
            className={styles.redoSearchButton}
            onClick={handleRedoSearchHereButtonClick}
          >
            Redo search here&nbsp;<Icon type="reload" />
          </Button>
        )}
        <Button.Group
          size="larger"
          className={styles.floatButtons}
        >
          <Button
            type="primary"
            onClick={() => { handleViewChange('list'); }}
          >
            <Icon type="bars" />&nbsp;RESULTS
          </Button>
          <Button
            type="primary"
            onClick={handleNewMarkerButtonClick}
          >
            NEW&nbsp;<Icon type="plus" />
          </Button>
        </Button.Group>
        <div id="js-feed-map" className={styles.feedMap} />
      </DefaultLayout>
    );
  }
}

FeedMapMobile.propTypes = {
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
    showRecalculateMarkersButton: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
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
            userName: PropTypes.string,
            joinedAt: PropTypes.instanceOf(Date),
          })
        ),
        // numPosts: PropTypes.number,
      })
    ).isRequired,
    numLoadedMarkers: PropTypes.number.isRequired,
    numTotalMarkers: PropTypes.number.isRequired,
  }).isRequired,
  handleViewChange: PropTypes.func.isRequired,
  handleMapPan: PropTypes.func.isRequired,
  handleRedoSearchHereButtonClick: PropTypes.func.isRequired,
  handleNewMarkerButtonClick: PropTypes.func.isRequired,
};

export default FeedMapMobile;
