import React, { PropTypes } from 'react';
import Waypoint from 'react-waypoint';
import _ from 'underscore';
import { Row, Col, Form, Button, Icon } from 'antd';
const FormItem = Form.Item;
import DefaultLayoutContainer from '../../layouts/default-layout.jsx';
// import AuxFunctions from '../../../api/aux-functions.js';
import Constants from '../../../api/constants.js';
import GoogleAutoCompleteControlled from '../../components/forms/google-auto-complete-controlled.jsx';
import SliderControlled from '../../components/forms/slider-controlled';
import CardsContainer from '../../components/feed/marker-cards/cards-container.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const FeedListMobile = (props) => {
  const {
    reduxState,
    meteorData,
    handleViewChange,
    handleSearchTextChange,
    handlePlaceChange,
    handleNewMarkerButtonClick,
    handleMarkerCardClick,
    handlePageLimitReached,
  } = props;
  const { searchText, searchType, place, mapBounds, errors } = reduxState;
  const { radius } = place;
  const { markers, markersReady, numLoadedMarkers, numTotalMarkers } = meteorData;

  return (
    <DefaultLayoutContainer width="600px" padding="20px 15px 0">
      <Button.Group
        size="larger"
        className="cm-float-buttons"
      >
        {/* Only display change view button if either search type is set */}
        {(!_.isEmpty(place) || !_.isEmpty(mapBounds)) && (
          <Button
            type="primary"
            onClick={() => { handleViewChange('map'); }}
          >
            <span><Icon type="environment-o" /> MAP</span>
          </Button>
        )}
        <Button
          type="primary"
          onClick={handleNewMarkerButtonClick}
        >
          <span>NEW <Icon type="plus" /></span>
        </Button>
      </Button.Group>
      <div className="mt1">
        <Row type="flex" justify="space-around" align="middle">
          <Col span={24}>
            <Form>
              <FormItem>
                <GoogleAutoCompleteControlled
                  id="searchText"
                  placeholder="City or Postcode..."
                  value={searchText}
                  onChange={handleSearchTextChange}
                  onSelect={handlePlaceChange}
                  // errorText={AuxFunctions.getFieldNameErrors(errors, 'searchText')}
                  // style={{ width: '100%' }}
                />
              </FormItem>
            </Form>
          </Col>
        </Row>
        {searchType === 'place' && radius && _.isNumber(radius) && radius > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex-none">
              Radius:
            </div>
            <div className="flex-auto mx2">
              <SliderControlled
                id="radius"
                min={Constants.FEED_MIN_RADIUS}
                max={Constants.FEED_MAX_RADIUS}
                value={radius}
                onChange={handlePlaceChange}
              />
            </div>
            <div className="flex-none">
              {radius} mile(s)
            </div>
          </div>
        )}
      </div>
      <div className="mt2">
        <CardsContainer
          items={markers}
          itemsReady={markersReady}
          onItemClick={handleMarkerCardClick}
        />
      </div>
      {markersReady && (numTotalMarkers > numLoadedMarkers) && (
        <Waypoint
          onEnter={handlePageLimitReached}
        />
      )}
    </DefaultLayoutContainer>
  );
};

FeedListMobile.propTypes = {
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
  handleViewChange: PropTypes.func.isRequired,
  handleSearchTextChange: PropTypes.func.isRequired,
  handlePlaceChange: PropTypes.func.isRequired,
  handleNewMarkerButtonClick: PropTypes.func.isRequired,
  handleMarkerCardClick: PropTypes.func.isRequired,
  handlePageLimitReached: PropTypes.func.isRequired,
};

export default FeedListMobile;
