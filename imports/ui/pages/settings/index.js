import React from 'react';
import Header from '../../Header.js';
import SettingsForm from '../../components/settings/settings-form/index.js';

// TODO: redirect user to Login page if not authenticated
// TODO: need AppContainer to handle global subscriptions
// --> try to use a re-usable userApolloQuery

//------------------------------------------------------------------------------
// COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'View' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
const Settings = () => (
    <div className="App">
      <Header />
      <div className="App-block">
        <div className="App-content">
        <SettingsForm />
      </div>
    </div>
  </div>
);

export default Settings;

//------------------------------------------------------------------------------
// APOLLO INTEGRATION:
//------------------------------------------------------------------------------
/**
* We use `gql` from graphql-tag to parse GraphQL query strings into the
* standard GraphQL AST. See for more information:
* https://github.com/apollographql/graphql-tag
*/
/* const GET_USER_DATA = gql`
  query getCurrentUser {
    user {
      _id
      sports
      location
    }
  }
`; */

/*
const GET_USER_DATA = gql`
  query getCurrentUser {
    user {
      _id
      sports
      location {
        placeId
        address
        center {
          lat
          lng
        }
      }
    }
  }
`;
*/

/**
* We use the `graphql` higher order component to send the graphql query to our
* server. See for more information: http://dev.apollodata.com/react/
*/
// const withData = graphql(GET_USER_DATA);

// export default withData(withRedux(Settings));



/* import React from 'react';
import PropTypes from 'prop-types';

import Header from '../../Header';
import Loading from '../../Loading';
// import LoginForm from './LoginForm';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Page component should be graphql agnostic.


const Settings = (props) => {
  const {
    curUserLoading,
    hasErrors,
    curUser,
    refetch,
  } = props;

  // console.log('data', data);

  if (curUserLoading) return <Loading />;
  else if (hasErrors) return <p>Error!</p>;

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
  curUserLoading: PropTypes.bool,
  hasErrors: PropTypes.bool,
  curUser: PropTypes.object,
  refetch: PropTypes.func,
};

export default Settings; */
