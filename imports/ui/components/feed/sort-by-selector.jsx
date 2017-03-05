import React, { Component, PropTypes } from 'react';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class SortBySelector extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    // Get context
    const { onChange } = this.props;
    // Get value
    const value = evt.target.value;
    // Pass data up to parent component
    onChange(value);
  }

  renderOptions() {
    const options = [
      { label: 'Recent', value: 'recent' },
      { label: 'Popular', value: 'popular' },
    ];
    return options.map(({ label, value }, index) => (
      <option key={index} value={value}>{label}</option>
    ));
  }

  render() {
    const { value } = this.props;

    return (
      <div className="sort-by-selector-component">
        <span className="sort-by">SORT BY :</span>
        <select
          className="sort-by-selector"
          onChange={this.handleChange}
          value={value}
        >
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}

SortBySelector.propTypes = {
  value: PropTypes.oneOf(['recent', 'popular']).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SortBySelector;
