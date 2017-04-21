import React, { Component } from 'react';
import { compose } from 'react-apollo'; // could use Recompose or import from redux instead
import PropTypes from 'prop-types';
import { pick } from 'lodash';

import { withRedux } from './container.js';
import withCurUserData from '../../../../api/gql-providers/queries/cur-user';
import Constants from '../../../../api/constants.js';
import InputControlled from '../../form-components/input-controlled.js';

/*
 * Demonstrate the use of `withApollo` higher order component to give access to
 * the Apollo Client directly in the component's props as `client`.
 * `client` is used here to reset the data store when the current user changes.
 * See for more information: http://dev.apollodata.com/core/meteor.html#Accounts
 */
class SettingsForm extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    // this.handleLocationOptionSelect = this.handleLocationOptionSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ fieldName, value }) {
    console.log('fieldName', fieldName);
    console.log('value', value);
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    // Update redux state
    switch (fieldName) {
      /* case 'maxParticipants':
        reduxActions.dispatchSetNumericField(fieldName, parseInt(value, 10));
        break;
      case 'date':
      case 'time':
        reduxActions.dispatchSetDateField(fieldName, value);
        break; */
      default:
        reduxActions.dispatchUpdateTextField(fieldName, value);
        break;
    }

    // Clear errors for the field being modified
    if (errors[fieldName].length > 0) {
      reduxActions.dispatchClearErrors(fieldName);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('handleFormSubmit');
    const { reduxState, reduxActions } = this.props;
    const formFields = [
      'sports',
      'location',
    ];

    // Clear errors if any
    reduxActions.dispatchClearErrors(formFields);

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmit', false);

    // Get new marker fields from redux state
    const newSettings = pick(reduxState, formFields);

    console.log(newSettings);

    // Check for errors
    // const errors = Markers.api.checkNewMarkerFields(newMarker);

    // In case of errors, warn user and prevent the meteor method to be called
    /* if (AuxFunctions.hasErrors(errors)) {
      // Display errors on UI
      reduxActions.dispatchSetErrors(errors);
      // Display flash notification
      // Bert.alert('The form has errors', 'danger', 'growl-top-right');
      console.log('The form has errors');
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmit', true);
      return;
    } */

    /* Meteor.call('Markers.methods.createMarker', newMarker, (err1, markerId) => {
      if (err1) {
        Bert.alert(err1.reason, 'danger', 'growl-top-right');
        // Re-enable submit button
        reduxActions.dispatchSetBooleanField('canSubmit', true);
      } else {
        Meteor.call('Users.methods.attachMarkerToUser', markerId, 'new', (err2) => {
          if (err2) {
            Bert.alert(err2.reason, 'danger', 'growl-top-right');
            // Re-enable submit button
            reduxActions.dispatchSetBooleanField('canSubmit', true);
          } else {
            Bert.alert('Activity create successfully!', 'success', 'growl-top-right');
            FlowRouter.go('marker', { markerId });
          }
        });
      }
    }); */
  }

  render() {
    // Destructure props
    const {
      reduxState,
      data: {
        error,
        loading,
        user,
        refetch,
      },
    } = this.props;

    console.log('props', this.props);

    // console.log('reduxState', reduxState);

    if (loading) {
      return <p>loading...</p>; //<Loading />;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    /* if (!user) {
      return <p>Please, log in!</p>;
    } */

    return (
      <form onSubmit={this.handleSubmit}>
        <InputControlled
          id="location"
          placeholder="Neighbour, City or Postcode"
          value={location}
          onChange={this.handleChange}
        />
        <br />
        {Constants.MARKER_SPORTS_ARRAY.map(sport => (
          <div key={sport}>
            <input type="checkbox" onChange={this.handleChange} />{sport}
          </div>
        ))}
        <button type="submit">
          Submit
        </button>
      </form>
    );
  }
}

/* SettingsForm.propTypes = {
  canSubmit: PropTypes.bool.isRequired,
  sports: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  errors: PropTypes.shape({
    sports: PropTypes.array.isRequired,
    location: PropTypes.array.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}; */

SettingsForm.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    sports: PropTypes.object,
    location: PropTypes.string,
    selectedLocation: PropTypes.shape({
      placeId: PropTypes.string,
      address: PropTypes.string,
      coordinates: PropTypes.object,
    }).isRequired,
    errors: PropTypes.shape({
      sports: PropTypes.array.isRequired,
      location: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  data: PropTypes.shape({
    user: PropTypes.object,
    errors: PropTypes.object,
    refetch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};

SettingsForm.defaultProps = {
  data: PropTypes.shape({
    user: null,
    errors: false,
    refetch: () => {},
    loading: false,
  }),
};


// export default SettingsForm;
export default compose(withRedux, withCurUserData)(SettingsForm);
