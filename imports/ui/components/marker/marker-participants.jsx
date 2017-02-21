import React, { PropTypes } from 'react';
import { Button } from 'antd';
import _ from 'underscore';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const MarkerParticipants = (props) => {
  const {
    curUserId,
    participants,
    maxParticipants,
    onJoinUnjoinButtonClick,
  } = props;

  const items = participants.map(({ userName, userAvatar }, index) => (
    <li key={index}>
      <img
        src={userAvatar}
        alt={userName}
        className="cm-participant-image"
      />
      <span>{userName}</span>
    </li>
  ));

  // Determine button's text
  const curUserIsInParticipantsList = curUserId && _.indexOf(_.pluck(participants, 'userId'), curUserId) !== -1;
  const text = curUserIsInParticipantsList ? 'UNJOIN' : 'JOIN';

  return (
    <div className="marker-participants-component">
      <h2>Participants</h2>
      <Button onClick={onJoinUnjoinButtonClick}>
        {text}
      </Button>
      <ul>
        {items}
      </ul>
    </div>
  );
};

MarkerParticipants.propTypes = {
  curUserId: PropTypes.string,
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string,
      userName: PropTypes.string,
      userAvatar: PropTypes.string,
      joinedAt: PropTypes.instanceOf(Date),
    }).isRequired
  ),
  maxParticipants: PropTypes.number.isRequired,
  onJoinUnjoinButtonClick: PropTypes.func.isRequired,
};

export default MarkerParticipants;
