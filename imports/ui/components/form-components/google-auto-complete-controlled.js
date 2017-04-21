import React, { Component, PropTypes } from 'react';
import _ from 'underscore';
import { Input, Select, Button, Icon } from 'antd';
const Option = Select.Option;
import classNames from 'classnames';
import Constants from '../../../api/constants.js';

//------------------------------------------------------------------------------
// GLOBALS:
//------------------------------------------------------------------------------
// Debounce meteor method call to get searchText options from google maps API
const debouncedCall = _.debounce(Meteor.call, 500);
let getPlaceIdLocationMethodDone = true;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// TODO: add errors for method callback
// When an input element is "controlled" by a model, the cursor will jump to the
// end of the line on every change. This makes it impossible to edit text that
// is not at the end of the input.
// SOURCE: see jimbola https://github.com/reactjs/react-redux/issues/525
class GoogleAutoCompleteControlled extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      value: props.value || '',
      loading: false,
      options: [], // [{ placeId: '', description: '', center: {} }, ...]
      errors: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
    return true;
  }

  handleChange(value) {
    const { id, onChange } = this.props;

    // Clear errors if any
    this.setState({ value, errors: [] });

    // Don't calculate options in case the onChange event is fired when the user
    // selects one of the options in the dropdown menu. Otherwise the list
    // of options is re-calucalted and re-displayed after one of the options is
    // selected.
    if (getPlaceIdLocationMethodDone === false) {
      this.setState({ options: [] });
      return;
    }

    // Minimum num of chars to start searching
    if (value.trim().length >= Constants.GOOGLE_MAPS_AUTOCOMPLETE_OFFSET) {
      // Display loading indicator
      this.setState({ loading: true });
      // Get the list of options associated to the partial searchText using google maps API
      debouncedCall('GoogleMaps.methods.getAutocompleteOptions', value, (err, options) => {
        if (err) {
          console.log(err);
        } else {
          // Store options
          this.setState({ options });
          // Pass data up to parent component
          onChange({ fieldName: id, value });
        }
        // Hide loading indicator
        this.setState({ loading: false });
      });
    }
  }

  handleSelect(description, option) {
    const { onSelect } = this.props;
    const { options } = this.state;

    // Display loading indicator
    this.setState({ loading: true });
    getPlaceIdLocationMethodDone = false;

    // Get selected option from placeId
    const index = _.indexOf(_.pluck(options, 'description'), description);
    if (index === -1) {
      throw new Meteor.Error('Unknow value at GoogleAutoCompleteControlled');
    }
    const selectedOption = options[index];
    const placeId = selectedOption.placeId;

    // Calculate coordinates (center) for the selected option / placeId
    Meteor.call('GoogleMaps.methods.getPlaceIdLocation', placeId, (err, center) => {
      if (err) {
        // Bert.alert(err.reason, 'danger', 'growl-top-right');
        console.log(err);
      } else {
        _.extend(selectedOption, { center });
        // Pass data up to parent component
        onSelect(selectedOption);
      }
      getPlaceIdLocationMethodDone = true;
      // Hide loading indicator
      this.setState({ loading: false });
    });
  }

  render() {
    const { id, value, onChange, onSelect, ...other } = this.props;
    const { loading, options } = this.state;

    // Select options
    const children = options.map(({ placeId, description }) => {
      return <Option key={description}>{description}</Option>;
    });

    // TODO: pass Options array with all the data about locations. Then on
    // handleSelect() get selectedOption
    return (
      <div id={id}>
        <Select
          combobox
          filterOption={false}
          value={this.state.value}
          onSelect={this.handleSelect}
          onChange={this.handleChange}
          notFoundContent="no results found" // TODO!
          {...other}
        >
          {children}
        </Select>
        <span>{loading && 'loading...'}</span>
      </div>
    );
  }
}

GoogleAutoCompleteControlled.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  // see material-ui documentation
};

export default GoogleAutoCompleteControlled;
