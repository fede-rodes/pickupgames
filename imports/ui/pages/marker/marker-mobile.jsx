import React, { PropTypes } from 'react';
import { Card } from 'antd';
import DefaultLayout from '../../layouts/default/default-layout.jsx';
import MarkerDetails from '../../components/marker/marker-details.jsx';
import MarkerParticipants from '../../components/marker/marker-participants.jsx';
import PostsSystemContainer from '../../components/posts-system/posts-system.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const MarkerMobile = (props) => {
  const {
    // reduxState,
    meteorData,
    handleJoinUnjoinButtonClick,
  } = props;

  // const { errors } = reduxState;
  const { marker, curUserId } = meteorData;

  return (
    <DefaultLayout width="600px" padding="20px 15px 0">
      <Card className="mt1">
        <MarkerDetails
          marker={marker}
        />
      </Card>
      <Card className="mt1">
        <MarkerParticipants
          curUserId={curUserId}
          participants={marker.participants}
          maxParticipants={marker.maxParticipants}
          onJoinUnjoinButtonClick={handleJoinUnjoinButtonClick}
        />
      </Card>
      <Card className="mt1">
        <PostsSystemContainer postedOn={marker._id} />
      </Card>
    </DefaultLayout>
  );
};

MarkerMobile.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    errors: PropTypes.shape({
      joinUnjoin: PropTypes.array,
    }).isRequired,
  }).isRequired,
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    markerReady: PropTypes.bool.isRequired,
    marker: PropTypes.shape({
      _id: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
      createdBy: PropTypes.string,
      createdByName: PropTypes.string,
      createdByAvatar: PropTypes.string,
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
          userAvatar: PropTypes.string,
          joinedAt: PropTypes.instanceOf(Date),
        })
      ),
    }), // not required!
  }).isRequired,
  handleJoinUnjoinButtonClick: PropTypes.func.isRequired,
};

export default MarkerMobile;
