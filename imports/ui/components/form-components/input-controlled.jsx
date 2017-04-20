import React, { Component, PropTypes } from 'react';
import { Input } from 'antd';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// TODO: add color class onError
// When an input element is "controlled" by a model, the cursor will jump to the
// end of the line on every change. This makes it impossible to edit text that
// is not at the end of the input.
// SOURCE: see jimbola https://github.com/reactjs/react-redux/issues/525
class InputControlled extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.state = { value: props.value || '' };
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

  handleChange(e) {
    // console.log(e.nativeEvent());
    // Get context
    const { id, onChange } = this.props;
    // Get data
    const value = e.nativeEvent.target.value;
    // Update State
    this.setState({ value });
    // Pass data up to parent component
    onChange({ fieldName: id, value });
  }

  render() {
    const { id, value, onChange, ...other } = this.props;

    return <Input id={id} value={this.state.value} onChange={this.handleChange} {...other} />;
  }
}

InputControlled.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputControlled;
