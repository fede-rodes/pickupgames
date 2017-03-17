import React, { Component, PropTypes } from 'react';
import _ from 'underscore';
import { Card, Form, Button } from 'antd';
const FormItem = Form.Item;
import AuxFunctions from '../../../api/aux-functions.js';
import Constants from '../../../api/constants.js';
import DefaultLayout from '../../layouts/default/default-layout.jsx';
import GoogleMaps from '../../../api/google-maps/namespace.js';
import '../../../api/google-maps/api.js'; // GoogleMaps.api
import Counter from '../../components/forms/counter.jsx';
import SelectControlled from '../../components/forms/select-controlled.jsx';
import InputControlled from '../../components/forms/input-controlled.jsx';
import DatePickerControlled from '../../components/forms/date-picker-controlled.jsx';
import TimePickerControlled from '../../components/forms/time-picker-controlled.jsx';
import GoogleAutoCompleteControlled from '../../components/forms/google-auto-complete-controlled.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class AdminMarkerMobile extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // TODO: center based on user feed place / mapBounds
    const center = {
      lat: Constants.USER_DEFAULT_LAT,
      lng: Constants.USER_DEFAULT_LNG,
    };
    GoogleMaps.api.init('js-new-marker-map', center, Constants.NEW_MARKER_DEFAULT_ZOOM);
  }

  componentWillReceiveProps(nextProps) {
    const nextPlace = nextProps.reduxState.selectedLocation;
    const curPlace = this.props.reduxState.selectedLocation;

    /* console.log('------------------');
    console.log('willReceiveProps');
    console.log('GoogleMaps.api.placeIsEmpty(nextPlace):');
    console.log(GoogleMaps.api.placeIsEmpty(nextPlace));
    console.log('GoogleMaps.api.placesAreEqual(curPlace, nextPlace):');
    console.log(GoogleMaps.api.placesAreEqual(curPlace, nextPlace)); */
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
  }

  render() {
    const {
      reduxState,
      handleFormInputChange,
      handleLocationOptionSelect,
      handleFormSubmit,
    } = this.props;

    const {
      canSubmit,
      title,
      sport,
      date,
      time,
      address,
      description,
      cost,
      maxParticipants,
      errors,
    } = reduxState;

    const maxParticipantsOptions = [];
    for (let i = 2; i < 51; i++) {
      maxParticipantsOptions.push(i.toString());
    }

    return (
      <DefaultLayout width="600px" padding="20px 0 0 0">
        <Card className="mt1">
          <h1>Create Activity</h1>
          <Form onSubmit={handleFormSubmit}>
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
                onChange={handleFormInputChange}
              />
            </FormItem>
            <FormItem
              label="Title*"
              validateStatus={AuxFunctions.getFieldNameErrors(errors, 'title') && 'error' || ''}
              help={AuxFunctions.getFieldNameErrors(errors, 'title')}
            >
              <InputControlled
                type="textarea"
                id="title"
                placeholder="Title"
                value={title}
                onChange={handleFormInputChange}
                autosize={{ minRows: 2, maxRows: 4 }}
              />
              <Counter
                limit={Constants.MARKER_TITLE_MAX_LENGTH}
                cur={title.length}
                className="block right-align"
              />
            </FormItem>
            <FormItem
              label="Description (Optional)"
              validateStatus={AuxFunctions.getFieldNameErrors(errors, 'description') && 'error' || ''}
              help={AuxFunctions.getFieldNameErrors(errors, 'description')}
            >
              <InputControlled
                type="textarea"
                id="description"
                placeholder="Description"
                value={description}
                onChange={handleFormInputChange}
                autosize={{ minRows: 4, maxRows: 6 }}
              />
              <Counter
                limit={Constants.MARKER_DESCRIPTION_MAX_LENGTH}
                cur={description.length}
                className="block right-align"
              />
            </FormItem>
            <FormItem
              label="Date*"
              validateStatus={AuxFunctions.getFieldNameErrors(errors, 'date') && 'error' || ''}
              help={AuxFunctions.getFieldNameErrors(errors, 'date')}
            >
              <DatePickerControlled
                id="date"
                placeholder="Date"
                value={date}
                onChange={handleFormInputChange}
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
                onChange={handleFormInputChange}
              />
            </FormItem>
            <FormItem
              label="Address*"
              validateStatus={AuxFunctions.getFieldNameErrors(errors, 'address') && 'error' || ''}
              help={AuxFunctions.getFieldNameErrors(errors, 'address')}
            >
              <GoogleAutoCompleteControlled
                id="address"
                placeholder="Exact address"
                value={address}
                onChange={handleFormInputChange}
                onSelect={handleLocationOptionSelect}
              />
            </FormItem>
            <div id="js-new-marker-map" className="mt1 mb2 full-width h200"></div>
            <FormItem
              label="Maximum number of participants (Optional)"
              validateStatus={AuxFunctions.getFieldNameErrors(errors, 'maxParticipants') && 'error' || ''}
              help={AuxFunctions.getFieldNameErrors(errors, 'maxParticipants')}
            >
              <SelectControlled
                id="maxParticipants"
                placeholder="Maximum number of participants"
                value={maxParticipants && maxParticipants.toString() || null}
                options={maxParticipantsOptions}
                onChange={handleFormInputChange}
              />
            </FormItem>
            <FormItem
              label="Cost per person (Optional)"
              validateStatus={AuxFunctions.getFieldNameErrors(errors, 'cost') && 'error' || ''}
              help={AuxFunctions.getFieldNameErrors(errors, 'cost')}
            >
              <InputControlled
                type="text"
                id="cost"
                placeholder="ex. FREE, unionCard required, 5 euros, ..."
                value={cost}
                onChange={handleFormInputChange}
              />
              <Counter
                limit={Constants.MARKER_COST_MAX_LENGTH}
                cur={cost.length}
                className="block right-align"
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
        </Card>
      </DefaultLayout>
    );
  }
}

AdminMarkerMobile.propTypes = {
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

export default AdminMarkerMobile;
