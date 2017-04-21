import React, { Component, PropTypes } from 'react';
import { TimePicker } from 'antd';
import moment from 'moment';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// When an input element is "controlled" by a model, the cursor will jump to the
// end of the line on every change. This makes it impossible to edit text that
// is not at the end of the input.
// SOURCE: see jimbola https://github.com/reactjs/react-redux/issues/525
class TimePickerControlled extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.state = { value: props.value || null };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
    return true;
  }

  handleChange(time) {
    // Get context
    const { id, onChange } = this.props;
    // Get data
    // const value = e.target.value; // date
    // Update State
    this.setState({ value: time });
    // Pass data up to parent component
    onChange({ fieldName: id, value: new Date(time) });
  }

  render() {
    const { id, value, onChange, ...other } = this.props;

    return (
      <div id={id}>
        <TimePicker
          // defaultValue={moment().locale('en')}
          value={this.state.value && moment(this.state.value).locale('en') || null}
          onChange={this.handleChange}
          format="HH:mm"
          {...other}
        />
      </div>
    );
  }
}

TimePickerControlled.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  // see material-ui documentation
};

export default TimePickerControlled;
