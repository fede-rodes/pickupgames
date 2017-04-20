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
const Home = ({ data }) => {
  const { error, loading, curUser, refetch } = data;
  // console.log('data', data);

  if (loading) return <Loading />;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div className="App">
      <Header />
      <div className="App-block">
        <div className="App-content">
          <LoginForm />
          {curUser
            ? <div>
                <pre>{JSON.stringify(curUser, null, 2)}</pre>
                <button onClick={() => refetch()}>Refetch the query!</button>
              </div>
            : 'Please log in!'}
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
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
/*
 * The config object is the second argument you pass into the graphql() function,
 * after your GraphQL document. The config is optional and allows you to add
 * some custom behavior to your higher order component.
 * See: http://dev.apollodata.com/react/api-graphql.html
 *
 * config.options:
 * is an object or a function that allows you to define the specific behavior
 * your component should use in handling your GraphQL data.
 * The specific options available for configuration depend on the operation you
 * pass as the first argument to graphql(). There are options specific to
 * queries and mutations.
 * You can define config.options as a plain object, or you can compute your
 * options from a function that takes the component’s props as an argument.
 *
 * config.props:
 * The config.props property allows you to define a map function that takes your
 * props including the props added by the graphql() function (props.data for
 * queries and props.mutate for mutations) and allows you to compute a new props
 * object that will be provided to the component that graphql() is wrapping.
 * The function you define behaves almost exactly like mapProps from Recompose
 * providing the same benefits without the need for another library.
 * config.props is most useful when you want to abstract away complex functions
 * calls into a simple prop that you can pass down to your component.
 * Another benefit of config.props is that it also allows you to decouple your
 * pure UI components from your GraphQL and Apollo concerns. You can write your
 * pure UI components in one file and then keep the logic required for them to
 * interact with the store in a completely different place in your project. You
 * can accomplish this by your pure UI components only asking for the props
 * needed to render and config.props can contain the logic to provide exactly
 * the props your pure component needs from the data provided by your GraphQL API.
 *
 * Other props: skip, name, ...
 *
 * import { compose } from 'react-apollo';
 * The following example uses the compose() function to use multiple graphql() enhancers at once.
 *  export default compose(
 *    graphql(gql`query MyQuery1 { ... }`, { skip: props => !props.useQuery1 }),
 *    graphql(gql`query MyQuery2 { ... }`, { skip: props => props.useQuery1 }),
 *  )(MyComponent);
 *
 *  function MyComponent({ data }) {
 *    // The data may be from `MyQuery1` or `MyQuery2` depending on the value
 *    // of the prop `useQuery1`.
 *    console.log(data);
 *  }
 *
 * export default compose(
 *  withApollo,
 *  graphql(`query { ... }`),
 *  graphql(`mutation { ... }`),
 *  connect(...),
 * )(MyComponent);
 */
const config = { options: { notifyOnNetworkStatusChange: true } };

// Create our enhancer function.
const withData = graphql(GET_CUR_USER_DATA, config);

// Enhance our component.
export default withData(Home);
