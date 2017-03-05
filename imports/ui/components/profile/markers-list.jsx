import React, { Component, PropTypes } from 'react';
// import moment from 'moment';
import _ from 'underscore';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class MarkersList extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(evt) {
    // Get context
    const { onMarkerLinkClick } = this.props;
    // Get data
    const markerId = evt.target.id;
    // Pass data up to parent component
    onMarkerLinkClick(markerId);
  }

  renderMarkers(markersArray) {
    const list = markersArray.map((marker, index) => {
      const { _id, title, location /* , status */ } = marker;

      return (
        <div
          key={index}
          className="listing"
          id={_id}
          onClick={this.handleClick}
        >
          <p>{title}</p>
          <p>{location.description}</p>
          {/* <p className="marker-status">{status}</p> */}
        </div>
      );
    });
    return list;
  }

  render() {
    const { markers } = this.props;
    const createdMarkers = _.filter(markers, ({ markerType }) => (_.indexOf(markerType, 'created') !== -1));
    const joinedMarkers = _.filter(markers, ({ markerType }) => (_.indexOf(markerType, 'joined') !== -1));

    return (
      <div className="markers-list-component">
        <h2>Your Activities</h2>
        <h3>Created Activities ({createdMarkers.length})</h3>
        {this.renderMarkers(createdMarkers)}
        <h3>Joined Activities ({joinedMarkers.length})</h3>
        {this.renderMarkers(joinedMarkers)}
      </div>
    );
  }
}

MarkersList.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      markerType: PropTypes.array,
      title: PropTypes.string,
      description: PropTypes.string,
      location: PropTypes.object,
      flipDeadline: PropTypes.instanceOf(Date),
      flipped: PropTypes.bool,
    })
  ).isRequired,
  onMarkerLinkClick: PropTypes.func.isRequired,
};

export default MarkersList;
