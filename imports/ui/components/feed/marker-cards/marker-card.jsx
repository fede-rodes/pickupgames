import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Card, Icon } from 'antd';
import _ from 'underscore';
// import { Card, CardTitle, CardActions, CardHeader, CardText } from 'material-ui/Card';
// import AuxFunctions from '../../../../api/aux-functions.js';

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
        className="unit-0"
        style={{ width: '30px' }}
      >
        <img
          src={p.avatar}
          alt={p.name}
          height="25"
        />
      </div>
    )) || null;

    return (
      <Card
        onClick={this.handleClick}
        title={<span><Icon type="calendar" />&nbsp;{`${moment.utc(date).format('dddd, MMM Do YYYY')}`}</span>}
        extra={<span><Icon type="clock-circle-o" />&nbsp;{`${moment.utc(time).format('HH:mm')}h`}</span>}
        style={{ marginTop: '14px', cursor: 'pointer' }}
      >
        <h3>{title}</h3>
        <p title="Sport">
          <Icon type="tag-o" />&nbsp;{sport}
        </p>
        <p title="Address">
          <Icon type="environment-o" />&nbsp;{location.description}
        </p>
        <p title="Cost per person">
          <Icon type="credit-card" />&nbsp;{cost}
        </p>
        {/* <p title="Comments">
          <Icon type="message" />&nbsp;{numPosts}
        </p> */}
        {/* <p title="Participants / limit">
          <Icon type="user" />&nbsp;{`${participants.length} / ${maxParticipants}`}
        </p> */}
        <div className="flex-left top-gap">
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

      /* <Card
        onTouchTap={this.handleClick}
        containerStyle={{ marginTop: '14px', cursor: 'pointer' }}
      >
        <CardTitle
          title={title}
          subtitle={`${moment.utc(date).format('ddd, MMM Do YYYY')}, ${moment.utc(time).format('HH:mm')}h`}
        />
        <CardText>
          <p title="Location">
            <i className="fa fa-map-marker"></i>
            &nbsp;{location.description}
          </p>
          <p title="Participants / limit">
            <i className="fa fa-users"></i>
            &nbsp;{`${participants.length} / ${maxParticipants}`}
          </p>
        </CardText>
      </Card> */
