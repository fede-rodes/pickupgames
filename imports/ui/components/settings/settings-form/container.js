import { connect } from 'react-redux';
import Actions from '../../../redux/client/actions.js';

//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Enhancer function providing Redux integration to wraped component.
*/
const namespace = 'settings';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to component (namespace).
  const reduxActions = {
    dispatchUpdateTextField(fieldName, value) {
      return dispatch(Actions.updateTextField(namespace, fieldName, value));
    },
    dispatchSetNumericField(fieldName, value) {
      return dispatch(Actions.setNumericField(namespace, fieldName, value));
    },
    dispatchSetDateField(fieldName, value) {
      return dispatch(Actions.setDateField(namespace, fieldName, value));
    },
    dispatchSetBooleanField(fieldName, value) {
      return dispatch(Actions.setBooleanField(namespace, fieldName, value));
    },
    dispatchUpdateSelectedLocation(data) {
      return dispatch(Actions.updateSelectedLocation(namespace, data));
    },
    dispatchSetErrors(errorsObj) {
      return dispatch(Actions.setErrors(namespace, errorsObj));
    },
    dispatchClearErrors(fieldName) {
      return dispatch(Actions.clearErrors(namespace, fieldName));
    },
  };

  return { reduxActions };
}

// Create enhancer function
const withRedux = connect(mapStateToProps, mapDispatchToProps);

export { withRedux };
