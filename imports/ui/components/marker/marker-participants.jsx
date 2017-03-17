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
        className="circle block mx-auto"
        height="40"
      />
      <span className="block center">{userName.split(' ')[0]}</span>
      {/* <span>{userName.length <= 8 ? userName : `${userName.slice(0, 6)}...`}</span> */}
    </div>
  ));

  // Determine button's text
  const curUserIsInParticipantsList = curUserId && _.indexOf(_.pluck(participants, 'userId'), curUserId) !== -1;
  const isFull = !!maxParticipants && maxParticipants <= participants.length;
  const disabled = !curUserIsInParticipantsList && isFull;
  const text = curUserIsInParticipantsList ? 'UNJOIN' : 'JOIN';

  return (
    <div className="mt3">
      <h2>Participants {isFull && '(FULL)'}</h2>
      <Button
        className="mt1"
        onClick={onJoinUnjoinButtonClick}
        disabled={disabled}
      >
        {text}
      </Button>
      <div className="flex flex-wrap mt1">
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
  maxParticipants: PropTypes.number,
  onJoinUnjoinButtonClick: PropTypes.func.isRequired,
};

export default MarkerParticipants;
