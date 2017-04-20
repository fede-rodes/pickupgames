import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Header from './Header';
import Loading from './Loading';
import LoginForm from './LoginForm';

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
const Settings = ({ data }) => {
  const { error, loading, curUser, refetch } = data;
  // console.log('data', data);

  if (loading) return <Loading />;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div className="App">
      <Header />
      <div className="App-block">
        <div className="App-content">
          Settings Page :)
        </div>
      </div>
    </div>
  );
};

Settings.propTypes = {
  curUser: PropTypes.object,
  hasErrors: PropTypes.bool,
  refetch: PropTypes.func,
  userLoading: PropTypes.bool,
};

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
const withData = graphql(GET_CUR_USER_DATA, { options: { notifyOnNetworkStatusChange: true } });

export default withData(Settings);
