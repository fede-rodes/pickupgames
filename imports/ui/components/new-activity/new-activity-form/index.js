import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { compose } from 'react-apollo'; // could use Recompose or import from redux instead
import { pick, isEqual } from 'lodash';

import withRedux from '../redux-provider.js';
// import withCurUserData from '../../../../api/gql-providers/queries/cur-user';
import createActivityMutation from '../../../../api/gql-providers/mutations/create-activity';
import Users_mutations_attachActivityToUser from '../../../../api/gql-providers/mutations/attach-activity-to-user';

import { Bert } from 'meteor/themeteorchef:bert';
import { Form, Button } from 'antd';
const FormItem = Form.Item;
import AuxFunctions from '../../../../api/aux-functions.js';
import Constants from '../../../../api/constants.js';
import GoogleMaps from '../../../../api/google-maps/namespace.js';
import '../../../../api/google-maps/api.js'; // GoogleMaps.api
// import Counter from '../../forms/counter.jsx';
import SelectControlled from '../../forms/select-controlled.jsx';
// import InputControlled from '../../forms/input-controlled.jsx';
import DatePickerControlled from '../../forms/date-picker-controlled.jsx';
import TimePickerControlled from '../../forms/time-picker-controlled.jsx';
// import GoogleAutoCompleteControlled from '../../forms/google-auto-complete-controlled.jsx';
import Markers from '../../../../api/markers/namespace.js';
import '../../../../api/markers/api.js'; // Markers.api

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class NewActivityForm extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleLocationOptionSelect = this.handleLocationOptionSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // TODO: center based on user feed place / mapBounds
    const center = {
      lat: Constants.USER_DEFAULT_LAT,
      lng: Constants.USER_DEFAULT_LNG,
    };
    GoogleMaps.api.init('js-new-marker-map', center, Constants.NEW_MARKER_DEFAULT_ZOOM);
  }

  /* componentWillReceiveProps(nextProps) {
    const nextPlace = nextProps.reduxState.selectedLocation;
    const curPlace = this.props.reduxState.selectedLocation;

    // console.log('------------------');
    // console.log('willReceiveProps');
    // console.log('GoogleMaps.api.placeIsEmpty(nextPlace):');
    // console.log(GoogleMaps.api.placeIsEmpty(nextPlace));
    // console.log('GoogleMaps.api.placesAreEqual(curPlace, nextPlace):');
    // console.log(GoogleMaps.api.placesAreEqual(curPlace, nextPlace));
    // TODO: try to use _.isEmpty instead of GoogleMaps.api.placeIsEmpty
    if (GoogleMaps.api.placeIsEmpty(nextPlace)) {
      return false; // do not re-render
    }
    if (_.isEqual(curPlace, nextPlace)) {
      return false; // do not re-render
    }

    // Remove previous marker before adding the new ones.
    GoogleMaps.api.clearMarkers();
    const { center } = nextPlace;
    GoogleMaps.api.setCenter(center);
    GoogleMaps.api.addMarker(center);

    return true;
  } */

  handleInputChange({ fieldName, value }) {
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    // Update redux state
    switch (fieldName) {
      case 'date':
      case 'time':
        reduxActions.dispatchSetDateField(fieldName, value);
        break;
      default:
        reduxActions.dispatchUpdateTextField(fieldName, value);
        break;
    }

    // Clear errors for the field being modified
    if (errors[fieldName].length > 0) {
      reduxActions.dispatchClearErrors(fieldName);
    }
  }

  /* handleLocationOptionSelect(selectedLocation) {
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateSelectedLocation(selectedLocation);
    reduxActions.dispatchUpdateTextField('address', selectedLocation.description);

    // Clear errors for the field being modified
    if (errors.address.length > 0) {
      reduxActions.dispatchClearErrors('address');
    }
  } */

  handleSubmit(e) {
    e.nativeEvent.preventDefault();
    const {
      reduxState,
      reduxActions,
      createActivityMutation,
      Users_mutations_attachActivityToUser,
      router,
    } = this.props;

    const formFields = [
      'sport',
      'venueId',
      // 'title',
      // 'description',
      'date',
      'time',
      // 'address',
      // 'selectedLocation',
      // 'maxParticipants',
      // 'cost',
    ];

    // Clear errors if any
    reduxActions.dispatchClearErrors(formFields);

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmit', false);

    // Get new marker fields from redux state
    const newMarker = pick(reduxState, formFields);

    // Check for errors
    const errors = Markers.api.checkNewMarkerFields(newMarker);

    // In case of errors, warn user and prevent the meteor method to be called
    if (AuxFunctions.hasErrors(errors)) {
      // TODO: Scroll to first error field
      // const errorKey = AuxFunctions.getFirstError(errors).key;
      // const elemYOffset = $(`#${elem}`).offset().top;
      // const elemYOffset = document.getElementById(elem).scrollTop;
      // console.log('elemYOffset', elemYOffset);
      // window.scrollTo(0, elemYOffset - 100);
      // Display errors on UI
      reduxActions.dispatchSetErrors(errors);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmit', true);
      return;
    }

    console.log('props', this.props);

    createActivityMutation({ variables: { ...newMarker } })
    .then(({ data: { createActivity: { _id } } }) => {
      // TODO: redirect user back to previous route
      console.log('history', router.history);
      // console.log('res', res);
      // router.history.push(`/activity-details/${_id}`);
      // TODO: clean redux store after redirect
      console.log('before 2 mutation', _id);
      Users_mutations_attachActivityToUser({ variables: { activityId: _id, actionType: 'NEW' } })
      .then((res) => {
        console.log('res', res);
        router.history.push(`/activity-details/${_id}`);
      })
      .catch((err) => {
        console.log(err);
        Bert.alert(err.reason, 'danger', 'growl-top-right');
        reduxActions.dispatchSetBooleanField('canSubmit', true);
      });;
    })
    .catch((err) => {
      console.log(err);
      Bert.alert(err.reason, 'danger', 'growl-top-right');
      reduxActions.dispatchSetBooleanField('canSubmit', true);
    });

    /*
        createActivityMutation({ variables: { ...newMarker } })
        .then(({ data: { createActivity: { _id } } }) => {
          // TODO: redirect user back to previous route
          console.log('history', router.history);
          // console.log('res', res);
          router.history.push(`/activity-details/${_id}`);
          // TODO: clean redux store after redirect
        })
        .catch((err) => {
          Bert.alert(err.reason, 'danger', 'growl-top-right');
          reduxActions.dispatchSetBooleanField('canSubmit', true);
        });
    */
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
            // FlowRouter.go('marker', { markerId });
          }
        });
      }
    }); */
  }

  render() {
    const {
      reduxState: {
        canSubmit,
        sport,
        venueId,
        date,
        time,
        errors,
      },
    } = this.props;

    return (

      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="Sport*"
          validateStatus={AuxFunctions.getFieldNameErrors(errors, 'sport') && 'error' || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'sport')}
        >
          <SelectControlled
            id="sport"
            placeholder="Sport"
            value={sport}
            options={Constants.MARKER_SPORTS_ARRAY}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="Select Venue*"
          validateStatus={AuxFunctions.getFieldNameErrors(errors, 'venueId') && 'error' || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'venueId')}
        >
          <SelectControlled
            id="venueId"
            placeholder="Select venue"
            value={venueId}
            options={['1', '2', '3']}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <div id="js-new-marker-map" className="mt1 mb2 full-width h200"></div>
        <FormItem
          label="Date*"
          validateStatus={AuxFunctions.getFieldNameErrors(errors, 'date') && 'error' || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'date')}
        >
          <DatePickerControlled
            id="date"
            placeholder="Date"
            value={date}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <FormItem
          label="Time*"
          validateStatus={AuxFunctions.getFieldNameErrors(errors, 'time') && 'error' || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'time')}
        >
          <TimePickerControlled
            id="time"
            placeholder="Time"
            value={time}
            onChange={this.handleInputChange}
          />
        </FormItem>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!canSubmit}
          size="large"
          loading={!canSubmit}
        >
          Create activity
        </Button>
      </Form>
    );
  }
}

NewActivityForm.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired, // TODO: use component state
    sport: PropTypes.oneOf([...Constants.MARKER_SPORTS_ARRAY, '']),
    venueId: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date),
    time: PropTypes.instanceOf(Date),
    errors: PropTypes.shape({
      sport: PropTypes.array.isRequired,
      venueId: PropTypes.array.isRequired,
      date: PropTypes.array.isRequired,
      time: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  createActivityMutation: PropTypes.func.isRequired,
  Users_mutations_attachActivityToUser: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withRedux,
  // withCurUserData,
  createActivityMutation,
  Users_mutations_attachActivityToUser
)(NewActivityForm);

// export default withRedux(NewActivityForm);
