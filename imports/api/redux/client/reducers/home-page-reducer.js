import expect from 'expect';
import deepFreeze from 'deep-freeze';
import {
  textFieldReducer,
  errorsReducer,
} from './shared-reducers.js';

/**
* Given the same arguments, it should calculate the next state and return it.
* No surprises. No side effects. No API calls. No mutations. Just a calculation.
*/

// Page reducer. Holds state for the whole page component. Delegates to smaller
// reducers as needed.
const initHomePageState = {
  searchText: '',
  errors: {
    searchText: [],
  },
};
const homePageReducer = (state = initHomePageState, action) => {
  if (action.namespace === 'home') {
    if (action.type === 'SET_INITIAL_STATE') {
      return initHomePageState;
    }

    const { fieldName } = action;
    switch (fieldName) {
      case 'searchText':
        return {
          ...state,
          [fieldName]: textFieldReducer(state[fieldName], action),
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
}

export default homePageReducer;

//------------------------------------------------------------------------------
// TESTS:
//------------------------------------------------------------------------------
const testHome = () => {
  const stateBefore = {};
  const action = {
    type: 'UPDATE_TEXT_FIELD',
    namespace: 'home',
    fieldName: 'searchText',
    value: 'hola',
  };
  const stateAfter = {
    searchText: 'hola',
  };

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    homePageReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

testHome();
console.log('All tests passed!');
