import React, { Component, PropTypes } from 'react';
import { DatePicker } from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
import moment from 'moment';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// When an input element is "controlled" by a model, the cursor will jump to the
// end of the line on every change. This makes it impossible to edit text that
// is not at the end of the input.
// SOURCE: see jimbola https://github.com/reactjs/react-redux/issues/525
class DatePickerControlled extends Component {
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

  handleChange(value) {
    const { id, onChange } = this.props;
    // Update State
    this.setState({ value });
    // Pass data up to parent component
    onChange({ fieldName: id, value: new Date(value) });
  }

  render() {
    const { id, value, onChange, ...other } = this.props;

    return (
      <div id={id}>
        <DatePicker
          // defaultValue={moment().locale('en')}
          value={this.state.value && moment(this.state.value).locale('en') || null}
          onChange={this.handleChange}
          format="DD/MM/YYYY"
          locale={enUS}
          {...other}
        />
      </div>
    );
  }
}

DatePickerControlled.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  // see material-ui documentation
};

export default DatePickerControlled;
