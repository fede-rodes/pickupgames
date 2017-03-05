/* import React, { PropTypes } from 'react';
import DefaultLayout from '../../layouts/default-layout.jsx';
import FixedWidth from '../../layouts/fixed-width.jsx';
import MarkersList from '../../components/profile/markers-list.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const ProfileMobile = (props) => (
  <DefaultLayout>
    <FixedWidth>
      <h1>Profile Page</h1>
      <MarkersList
        markers={props.markers}
        onMarkerLinkClick={props.handleMarkerLinkClick}
      />
    </FixedWidth>
  </DefaultLayout>
);

ProfileMobile.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      markerType: PropTypes.array,
      title: PropTypes.string,
      description: PropTypes.string,
      location: PropTypes.object,
    })
  ).isRequired,
  handleMarkerLinkClick: PropTypes.func.isRequired,
};

export default ProfileMobile;
*/
