import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Settings from './index.js';

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
  props: ({ data: { error, loading, curUser, refetch } }) => {
    if (loading) return { curUserLoading: true };
    if (error) return { hasErrors: true };

    return {
      curUser,
      refetch,
    };
  },
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
export default withData(Settings);
