import React from 'react';
import PropTypes from 'prop-types';

// Data
import withCurUserData from '../../../api/gql-providers/queries/cur-user';

import Loading from '../../components/loading';
import Header from '../../components/header';
import LoginForm from '../../components/login-form';

const DefaultLayout = ({ data, children }) => {
  const { error, loading, curUser, refetch } = data;
  console.log('data', data);

  if (loading) return <Loading />;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <div className="App">
      <Header />
      <div className="App-block">
        <div className="App-content">
          {curUser
            ? <div>
                {children}
                <pre>{JSON.stringify(curUser, null, 2)}</pre>
                <button onClick={() => refetch()}>Refetch the query!</button>
              </div>
            : <LoginForm />}
        </div>
      </div>
    </div>
  );
};

DefaultLayout.propTypes = {
  data: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
};

// export default DefaultLayout;

// Enhance our component.
export default withCurUserData(DefaultLayout);
