import React from 'react';
import PropTypes from 'prop-types';

import Header from '../../Header';
import Loading from '../../Loading';
// import LoginForm from './LoginForm';

//------------------------------------------------------------------------------
// PAGE COMPONENT DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Page component should be graphql agnostic.
*/

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

export default Settings;
