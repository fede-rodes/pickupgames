// import _ from 'underscore';
// import Constants from '../../../../api/constants.js';
import {
  textFieldReducer,
  objectFieldReducer,
  booleanFieldReducer,
  errorsReducer,
} from './shared-reducers.js';

/**
* Given the same arguments, it should calculate the next state and return it.
* No surprises. No side effects. No API calls. No mutations. Just a calculation.
*/
const initSelectedLocationState = {
  placeId: '',
  address: '',
  center: {},
};
const selectedLocationReducer = (state = initSelectedLocationState, action) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_LOCATION':
      return action.selectedLocation;
    case 'CLEAR_SELECTED_LOCATION':
      return initSelectedLocationState;
    default:
      return state;
  }
};

// Page reducer. Holds state for the whole page component. Delegates to smaller
// reducers as needed.
const initSettingsPageState = {
  canSubmit: true,
  sports: {},
  location: '',
  selectedLocation: {
    placeId: '',
    address: '',
    center: {},
  },
  errors: {
    sports: [],
    location: [],
  },
};
const settingsPageReducer = (state = initSettingsPageState, action) => {
  if (action.namespace === 'settings') {
    if (action.type === 'SET_INITIAL_STATE') {
      return initSettingsPageState;
    }

    const { fieldName } = action;
    switch (fieldName) {
      case 'canSubmit':
        return {
          ...state,
          [fieldName]: booleanFieldReducer(state[fieldName], action),
        };
      case 'location':
        return {
          ...state,
          [fieldName]: textFieldReducer(state[fieldName], action),
        };
      case 'sports':
        return {
          ...state,
          [fieldName]: objectFieldReducer(state[fieldName], action),
        };
      case 'selectedLocation':
        return {
          ...state,
          [fieldName]: selectedLocationReducer(state[fieldName], action),
        };
      case 'errors':
        return {
          ...state,
          [fieldName]: errorsReducer(state[fieldName], action),
        };
      default:
        return state;
    }
  }
  return state;
};

export default settingsPageReducer;
