import React, { PropTypes } from 'react';
import Constants from '../../../api/constants.js';
import DefaultLayoutContainer from '../../layouts/default-layout.jsx';
import NewMarkerForm from '../../components/new-marker/new-marker-form.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const NewMarkerMobile = (props) => {
  const {
    reduxState,
    handleFormInputChange,
    handleLocationOptionSelect,
    handleFormSubmit,
  } = props;

  return (
    <DefaultLayoutContainer width="600px" padding="20px 15px 0" forceLogin>
      <h1>Create Activity</h1>
      <NewMarkerForm
        {...reduxState}
        onChange={handleFormInputChange}
        onSelect={handleLocationOptionSelect}
        onSubmit={handleFormSubmit}
      />
    </DefaultLayoutContainer>
  );
};

NewMarkerMobile.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    sport: PropTypes.oneOf([...Constants.MARKER_SPORTS_ARRAY, '']),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    time: PropTypes.instanceOf(Date),
    address: PropTypes.string.isRequired,
    selectedLocation: PropTypes.shape({
      placeId: PropTypes.string,
      description: PropTypes.string,
      coordinates: PropTypes.object,
    }).isRequired,
    maxParticipants: PropTypes.number,
    cost: PropTypes.string,
    errors: PropTypes.shape({
      sport: PropTypes.array.isRequired,
      title: PropTypes.array.isRequired,
      description: PropTypes.array,
      date: PropTypes.array.isRequired,
      time: PropTypes.array.isRequired,
      address: PropTypes.array.isRequired,
      cost: PropTypes.array.isRequired,
      maxParticipants: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  handleFormInputChange: PropTypes.func.isRequired,
  handleLocationOptionSelect: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
};

export default NewMarkerMobile;
