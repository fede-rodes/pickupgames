import React, { PropTypes } from 'react';

const Counter = ({ limit, cur, className }) => (
  <span className={`${className} ${limit - cur > 0 ? 'dark-grey' : 'red'}`}>
    {limit - cur}
  </span>
);

Counter.propTypes = {
  limit: PropTypes.number.isRequired,
  cur: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default Counter;
