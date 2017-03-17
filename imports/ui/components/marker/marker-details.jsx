import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Icon } from 'antd';
import Constants from '../../../api/constants.js';
import GoogleMaps from '../../../api/google-maps/namespace.js';
import '../../../api/google-maps/api.js'; // GoogleMaps.api

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class MarkerDetails extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleSeeMore = this.handleSeeMore.bind(this);
    this.state = {
      seeMore: false,
    };
  }

  componentDidMount() {
    // Initialize google map and set marker
    const coordinates = this.props.marker.location.geometry.coordinates;
    const center = {
      lat: coordinates[1],
      lng: coordinates[0],
    };
    GoogleMaps.api.init('js-map', center, Constants.MARKER_DEFAULT_ZOOM);
    GoogleMaps.api.addMarker(center);
  }

  handleSeeMore() {
    this.setState({ seeMore: !this.state.seeMore });
  }

  renderSeeMoreLess() {
    return (
      <a
        href="#"
        className="blue"
        onClick={(e) => {
          e.preventDefault();
          this.handleSeeMore();
        }}
      >
        {this.state.seeMore ? 'See less' : 'See more'}
      </a>
    );
  }

  render() {
    const { curUserId, marker } = this.props;
    const {
      _id,
      createdAt,
      createdBy,
      createdByName,
      sport,
      title,
      description,
      date,
      time,
      location,
      cost,
    } = marker;

    const descriptionTruncated = description && description.length > 0 && description.split(' ').splice(0, 50).join(' ') || '';
    const displaySeeMoreLess = description && description.length > descriptionTruncated.length || false;

    return (
      <div>
        <div className="flex">
          <div className="flex-auto">
            <h2 className="pr1">{title}</h2>
            <span title="Created by">
              <small>{createdByName}</small>
              &nbsp;
              {curUserId && curUserId === createdBy && (
                <a href={`/admin-marker/${_id}`}>(Admin)</a>
              )}
            </span>
          </div>
          <div className="flex-none">
            <img
              src=""
              alt={sport}
              height="60"
              width="60"
            />
          </div>
        </div>
        <div className="mt2">
          <table>
            <tbody>
              <tr title="Date">
                <td className="pr1"><Icon type="calendar" /></td>
                <td>{moment.utc(date).format('dddd MMM Do YYYY')}</td>
              </tr>
              <tr title="Time">
                <td className="pr1"><Icon type="clock-circle-o" /></td>
                <td>{moment.utc(time).format('HH:mm')}h</td>
              </tr>
              {!!cost && (
                <tr title="Cost per person">
                  <td className="pr1"><Icon type="credit-card" /></td>
                  <td>{cost}</td>
                </tr>
              )}
              <tr title="Address">
                <td className="pr1"><Icon type="environment-o" /></td>
                <td>{location.description}</td>
              </tr>
            </tbody>
          </table>
          <div id="js-map" className="full-width h200 mt1"></div>
          {description && description.length > 0 && (
            <div className="mt2">
              <pre>
                {this.state.seeMore ? description : descriptionTruncated.trim().concat('...')}
              </pre>
              <div className="mt1">{displaySeeMoreLess && this.renderSeeMoreLess()}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

MarkerDetails.propTypes = {
  curUserId: PropTypes.string,
  marker: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    createdBy: PropTypes.string.isRequired,
    createdByName: PropTypes.string.isRequired,
    sport: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.instanceOf(Date).isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    location: PropTypes.object.isRequired,
    maxParticipants: PropTypes.number,
    cost: PropTypes.string,
  }).isRequired,
};

export default MarkerDetails;
