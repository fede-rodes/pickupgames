// Apollo
import { graphql /*, compose */ } from 'react-apollo';
import gql from 'graphql-tag';

// Redux
import { connect } from 'react-redux';
import Actions from '../../../redux/client/actions.js';

// import SettingsForm from './index.js';

//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'settings';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page (namespace).
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

const withRedux = connect(mapStateToProps, mapDispatchToProps);

//------------------------------------------------------------------------------
// APOLLO INTEGRATION:
//------------------------------------------------------------------------------
/*
 * We use `gql` from graphql-tag to parse GraphQL query strings into the standard GraphQL AST
 * See for more information: https://github.com/apollographql/graphql-tag
 */
const GET_CUR_USER_DATA = gql`
  query getCurUser {
    curUser {
      emails {
        address
        verified
      }
      randomString
      _id
    }
  }
`;

/*
 * Apollo Client lets you attach GraphQL queries to your UI components to easily load data
 *
 * We use the `graphql` higher order component to send the graphql query to our server
 * See for more information: http://dev.apollodata.com/react/
 * The graphql() container is the recommended approach for fetching data or
 * making mutations. It is a React Higher Order Component, and interacts with
 * the wrapped component via props.
 */
const config = {
  options: { notifyOnNetworkStatusChange: true },
  // Destructure the default props to more explicit ones
  /* props: ({ data: { error, loading, curUser, refetch } }) => {
    if (loading) return { curUserLoading: true };
    if (error) return { hasErrors: true };

    return {
      curUser,
      refetch,
    };
  }, */
};
const withData = graphql(GET_CUR_USER_DATA, config);

/*
data = {
  curUser: Object
  error: (...)
  fetchMore: function ()
  loading: false
  networkStatus: 7
  refetch: function ()
  startPolling: function ()
  stopPolling: function ()
  subscribeToMore: function ()
  updateQuery: function ()
  variables: Object
}
*/
// The data prop here comes from the Apollo HoC. It has the data
// we asked for, and also useful methods like refetch().

// Enhance the component by providing apollo data.
// export default withData(Settings);

// export default compose(withRedux, withData)(SettingsForm);

export { withRedux, withData };
