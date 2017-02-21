import { check, Match } from 'meteor/check';
import _ from 'underscore';

/**
* @namespace AuxFunctions
*/
const AuxFunctions = {};

//------------------------------------------------------------------------------
AuxFunctions.validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(email);
};
//------------------------------------------------------------------------------
AuxFunctions.validateUrl = (url) => {
  const re = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return re.test(url);
};
//------------------------------------------------------------------------------
AuxFunctions.validateAlphanumeric = (expression) => {
  const re = /^[a-z0-9]+$/i;
  return re.test(expression);
};
//------------------------------------------------------------------------------
/**
* @summary Get start of current date (today at 00:00:00).
*/
AuxFunctions.getStartCurDate = () => {
  const actualDate = new Date(); // 2013-07-30 17:11:00
  const startOfDayDate = new Date(actualDate.getFullYear()
                             , actualDate.getMonth()
                             , actualDate.getDate()
                             , 0, 0, 0); // 2013-07-30 00:00:00
  return startOfDayDate;
};
//------------------------------------------------------------------------------
/**
* @summary Get current year.
*/
AuxFunctions.getCurYear = () => {
  const now = new Date();
  const curYear = now.getFullYear(); // integer
  return curYear;
};
//------------------------------------------------------------------------------
/**
* @summary Get current month.
*/
AuxFunctions.getCurMonth = () => {
  const now = new Date();
  const curMonth = now.getMonth() + 1; // integer; now.getMonth() in [0, 11]
  return curMonth;
};
//------------------------------------------------------------------------------
/**
* @summary Is there any errors?
* @param {array} errors - Errors array.
*/
AuxFunctions.hasErrors = (errors) => {
  check(errors, Object);
  let response = false;

  // Go over all errors to see if at least one of them is not empty
  _.each(errors, (err) => {
    if (err.length > 0) {
      response = true;
    }
  });

  return response;
};
//------------------------------------------------------------------------------
/**
* @summary Return fieldName associated errors
* @param {array} errors - Errors array.
* @param {string} fieldName - Field name.
*/
AuxFunctions.getFieldNameErrors = (errors, fieldName) => {
  check(errors, Object);
  check(fieldName, String);

  return errors && errors[fieldName] && errors[fieldName].length > 0 && errors[fieldName].toString();
};
//------------------------------------------------------------------------------
/**
* @summary Clean error messages for the given field name (array of field names)
* leaving the remaining errors untached.
*/
AuxFunctions.clearErrors = (errors, fieldName) => {
  check(errors, Object);
  check(fieldName, Match.OneOf(String, [String]));

  const errorKeys = _.keys(errors);
  const clearedErrors = {};

  // Remove errors for the given field name
  _.each(errorKeys, (key) => {
    if ((_.isString(fieldName) && key === fieldName)
      || (_.isArray(fieldName) && _.indexOf(fieldName, key) !== -1)) {
      clearedErrors[key] = [];
    } else {
      clearedErrors[key] = errors[key];
    }
  });

  return clearedErrors;
};
//------------------------------------------------------------------------------
/**
* @summary Returns the first (not empty) error message.
*/
AuxFunctions.getFirstError = (errors) => {
  check(errors, Object);

  const errorKeys = _.keys(errors);
  const indexes = [];

  // Get the indexes of those keys that contain non-empty errors
  _.each(errorKeys, (key, index) => {
    if (errors[key].length > 0) {
      indexes.push(index);
    }
  });

  // No errors
  if (indexes.length === 0) {
    return '';
  }

  // Has errors
  const firstIndex = indexes[0];
  const keyFirstError = errorKeys[firstIndex]; // key associated to the first non-empty error
  return {
    key: keyFirstError,
    value: errors[keyFirstError][0],
  };
};
//------------------------------------------------------------------------------
/**
* @summary Returns the average value of the array.
*/
AuxFunctions.getAverage = (array) => {
  check(array, [Number]);

  const sum = array.reduce((total, value) => (
    total + value
  ), 0);

  return sum / array.length;
};
//------------------------------------------------------------------------------
/**
* @summary Returns the index of the maximum value of an array.
*/
AuxFunctions.getMaxValueIndex = (array) => {
  check(array, [Number]);

  let maxIndex = -1;
  let maxValue;
  _.each(array, (value, index) => {
    if (!maxValue || value >= maxValue) {
      maxValue = value;
      maxIndex = index;
    }
  });
  return maxIndex;
};
//------------------------------------------------------------------------------
/**
* @summary Checks whether the given option has some relevant data or is 'empty'
*/
AuxFunctions.optionIsEmpty = (selectedOption) => {
  check(selectedOption, Object);

  const values = _.values(selectedOption);
  let isEmpty = true;

  _.each(values, (value) => {
    if (value.length > 0) { // works for both string and array values
      isEmpty = false;
    }
  });
  return isEmpty;
};
//------------------------------------------------------------------------------

export default AuxFunctions;
