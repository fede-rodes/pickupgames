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
    <div
      key={index}
      className="p1"
      title={userName}
    >
      <img
        src={userAvatar}
        alt={userName}
        className="circle block"
        height="40"
      />
      <span>{userName.length <= 8 ? userName : `${userName.slice(0, 6)}...`}</span>
    </div>
  ));

  // Determine button's text
  const curUserIsInParticipantsList = curUserId && _.indexOf(_.pluck(participants, 'userId'), curUserId) !== -1;
  const text = curUserIsInParticipantsList ? 'UNJOIN' : 'JOIN';

  return (
    <div>
      <h2>Participants</h2>
      <Button onClick={onJoinUnjoinButtonClick}>
        {text}
      </Button>
      <div className="flex flex-wrap">
        {items}
      </div>
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
