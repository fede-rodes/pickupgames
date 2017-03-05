/* import React, { Component, PropTypes } from 'react';
import _ from 'underscore';
import { Form, Button } from 'antd';
const FormItem = Form.Item;
import AuxFunctions from '../../../api/aux-functions.js';
import Constants from '../../../api/constants.js';
import GoogleMaps from '../../../api/google-maps/namespace.js';
import '../../../api/google-maps/api.js'; // GoogleMaps.api
import SelectControlled from '../forms/select-controlled';
import InputControlled from '../forms/input-controlled';
import DatePickerControlled from '../forms/date-picker-controlled';
import TimePickerControlled from '../forms/time-picker-controlled';
import GoogleAutoCompleteControlled from '../forms/google-auto-complete-controlled.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class NewMarkerForm extends Component {
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
    GoogleMaps.api.init('new-marker-map', center, 12); // 12 = zoom
  }

  componentWillReceiveProps(nextProps) {
    const nextPlace = nextProps.selectedLocation;
    const curPlace = this.props.selectedLocation;

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
  }

  render() {
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
      onSelect,
      onChange,
      onSubmit,
    } = this.props;

    const maxParticipantsOptions = [];
    for (let i = 2; i < 51; i++) {
      maxParticipantsOptions.push(i.toString());
    }

    return (
      <Form>
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
            onChange={onChange}
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
            onChange={onChange}
            autosize={{ minRows: 2, maxRows: 4 }}
          />
        </FormItem>
        <FormItem
          label="Description"
          validateStatus={AuxFunctions.getFieldNameErrors(errors, 'description') && 'error' || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'description')}
        >
          <InputControlled
            type="textarea"
            id="description"
            placeholder="Description"
            value={description}
            onChange={onChange}
            autosize={{ minRows: 4, maxRows: 6 }}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            onSelect={onSelect}
            // style={{ width: '100%' }}
          />
        </FormItem>
        <div id="new-marker-map" className="mt1 mb2" style={{ width: '100%', height: '200px' }}></div>
        <FormItem
          label="Maximum number of participants*"
          validateStatus={AuxFunctions.getFieldNameErrors(errors, 'maxParticipants') && 'error' || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'maxParticipants')}
        >
          <SelectControlled
            id="maxParticipants"
            placeholder="Maximum number of participants"
            value={maxParticipants && maxParticipants.toString() || null}
            options={maxParticipantsOptions}
            onChange={onChange}
          />
        </FormItem>
        <FormItem
          label="Cost per person*"
          validateStatus={AuxFunctions.getFieldNameErrors(errors, 'cost') && 'error' || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'cost')}
        >
          <InputControlled
            type="text"
            id="cost"
            placeholder="ex. FREE, unionCard required, 5 euros, ..."
            value={cost}
            onChange={onChange}
          />
        </FormItem>
        <Button
          type="primary"
          onClick={onSubmit}
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

NewMarkerForm.propTypes = {
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
    center: PropTypes.object,
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
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default NewMarkerForm;
*/
