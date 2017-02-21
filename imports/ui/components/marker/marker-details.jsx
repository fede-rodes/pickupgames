import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Icon } from 'antd';
import GoogleMaps from '../../../api/google-maps/namespace.js';
import '../../../api/google-maps/api.js'; // GoogleMaps.api

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class MarkerDetails extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Initialize google map and set marker
    const coordinates = this.props.marker.location.geometry.coordinates;
    const center = {
      lat: coordinates[1],
      lng: coordinates[0],
    };
    GoogleMaps.api.init('map', center, 12); // 12 = zoom
    GoogleMaps.api.addMarker(center);
  }

  render() {
    // Deconstruct
    const {
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
    } = this.props.marker;

    return (
      <div className="marker-details-component">
        <div className="flex-left units-gap">
          <div className="unit">
            <h2>{title}</h2>
            <span title="Created by">
              <small>{createdByName}</small>
            </span>
          </div>
          <div className="unit-0">
            <img
              src=""
              alt={sport}
              height="60"
              width="60"
              style={{ float: 'right' }}
            />
          </div>
        </div>
        <div className="top-gap">
          <table>
            <tbody>
              <tr title="Date">
                <td style={{ paddingRight: '10px' }}><Icon type="calendar" /></td>
                <td>{moment.utc(date).format('dddd MMM Do YYYY')}</td>
              </tr>
              <tr title="Time">
                <td style={{ paddingRight: '10px' }}><Icon type="clock-circle-o" /></td>
                <td>{moment.utc(time).format('HH:mm')}h</td>
              </tr>
              <tr title="Cost per person">
                <td style={{ paddingRight: '10px' }}><Icon type="credit-card" /></td>
                <td>{cost}</td>
              </tr>
              <tr title="Address">
                <td style={{ paddingRight: '10px' }}><Icon type="environment-o" /></td>
                <td>{location.description}</td>
              </tr>
            </tbody>
          </table>
          <div id="map" className="map top-gap" style={{ width: '100%', height: '200px', border: '1px solide #e9e9e9' }}></div>
          {description && description.length > 0 && (
            <div>
              <hr />
              <pre className="top-gap">
                <small>{description}</small>
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }
}

MarkerDetails.propTypes = {
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
    maxParticipants: PropTypes.number.isRequired,
    cost: PropTypes.string.isRequired,
  }).isRequired,
};

export default MarkerDetails;
