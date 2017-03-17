import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Card, Icon } from 'antd';
// import _ from 'underscore';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class MarkerCard extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Get context
    const { data, onClick } = this.props;
    // Pass data up to parent component
    onClick(data._id);
  }

  render() {
    // Get context
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
      maxParticipants,
      cost,
      participants,
      // numPosts,
    } = this.props.data;

    const avatars = participants.map((p, index) => (
      <div
        key={index}
        className="flex-none pr1"
        title={p.name}
      >
        <img
          src={p.avatar}
          alt={p.name}
          height="30"
        />
      </div>
    )) || null;

    return (
      <Card
        className="mt1 pointer"
        title={<span><Icon type="calendar" />&nbsp;{`${moment.utc(date).format('dddd, MMM Do YYYY')}`}</span>}
        extra={<span><Icon type="clock-circle-o" />&nbsp;{`${moment.utc(time).format('HH:mm')}h`}</span>}
        onClick={this.handleClick}
      >
        <h3>{title}</h3>
        <p title="Sport">
          <Icon type="tag-o" />&nbsp;{sport}
        </p>
        <p title="Address">
          <Icon type="environment-o" />&nbsp;{location.description}
        </p>
        {!!cost && (
          <p title="Cost per person">
            <Icon type="credit-card" />&nbsp;{cost}
          </p>
        )}
        {/* <p title="Comments">
          <Icon type="message" />&nbsp;{numPosts}
        </p> */}
        <div title="Participants" className="flex flex-wrap mt1">
          {avatars}
        </div>
      </Card>
    );
  }
}

MarkerCard.propTypes = {
  data: PropTypes.shape({
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
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MarkerCard;
