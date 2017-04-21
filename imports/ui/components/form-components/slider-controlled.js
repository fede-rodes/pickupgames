import React, { Component, PropTypes } from 'react';
// import Slider from 'material-ui/Slider';
import { Slider } from 'antd';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
// When an input element is "controlled" by a model, the cursor will jump to the
// end of the line on every change. This makes it impossible to edit text that
// is not at the end of the input.
// SOURCE: see jimbola https://github.com/reactjs/react-redux/issues/525
class SliderControlled extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    // this.state = { value: props.value || '' };
    this.handleChange = this.handleChange.bind(this);
  }

  /* componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  } */

  handleChange(radius) {
    // Get context
    const { id, onChange } = this.props;
    // Get data
    // const value = e.target.value;
    // Update State
    // this.setState({ value });
    // Pass data up to parent component
    onChange({ radius });
  }

  render() {
    const { id, value, onChange, ...other } = this.props;

    return (
      <Slider
        id={id}
        // value={this.state.value}
        value={value}
        onChange={this.handleChange}
        {...other}
      />
    );
  }
}

SliderControlled.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  // see material-ui documentation
};

export default SliderControlled;
