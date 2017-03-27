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
    const nextPlace = nextProps.reduxState.location;
    const curPlace = this.props.reduxState.location;

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
      date,
      time,
      address,
      location,
      description,
      maxParticipants,
      cost,
      // participants: PropTypes.array.isRequired,
      errors,
    } = reduxState;

    const maxParticipantsOptions = [];
    for (let i = 2; i < 51; i++) {
      maxParticipantsOptions.push(i.toString());
    }

    return (
      <DefaultLayout width="600px">
        <Card>
          <h1>Admin Activity</h1>
          <Form onSubmit={handleFormSubmit}>
            {/* <FormItem
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
            </FormItem> */}
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
              label={<span>Description <strong>(Optional)</strong></span>}
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
              label={<span>Maximum number of participants <strong>(Optional)</strong></span>}
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
              label={<span>Cost per person <strong>(Optional)</strong></span>}
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
              Save
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
    title: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    time: PropTypes.instanceOf(Date),
    address: PropTypes.string,
    location: PropTypes.object,
    description: PropTypes.string,
    maxParticipants: PropTypes.number,
    cost: PropTypes.string,
    // participants: PropTypes.array.isRequired,
    errors: PropTypes.shape({
      title: PropTypes.array,
      date: PropTypes.array,
      time: PropTypes.array,
      address: PropTypes.array,
      description: PropTypes.array,
      maxParticipants: PropTypes.array,
      cost: PropTypes.array,
      // participants: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  handleFormInputChange: PropTypes.func.isRequired,
  handleLocationOptionSelect: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
};

export default AdminMarkerMobile;
