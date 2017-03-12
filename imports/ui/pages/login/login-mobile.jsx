import React, { PropTypes } from 'react';
import { Button } from 'antd';
import AuxFunctions from '../../../api/aux-functions.js';
import DefaultLayout from '../../layouts/default/default-layout.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const LoginMobile = (props) => {
  const { reduxState, handleSubmit } = props;
  const { canSubmit, errors } = reduxState;

  return (
    <DefaultLayout width="350px" padding="20px 15px 0" withHeader={false}>
      <img
        src="/images/logo.png"
        alt="logo"
        className="block my0 mx-auto full-width"
      />
      <h1 className="center">
        Find pick-up games <br /> in your city ...
      </h1>
      <Button
        size="large"
        type="primary"
        className="mt3 full-width"
        onClick={handleSubmit}
        disabled={!canSubmit}
        loading={!canSubmit}
      >
        Continue with facebook
      </Button>
      <span>{AuxFunctions.hasErrors(errors) && AuxFunctions.getFirstError(errors)}</span>
    </DefaultLayout>
  );
};

LoginMobile.propTypes = {
  reduxState: PropTypes.shape({
    canSubmit: PropTypes.bool.isRequired,
    errors: PropTypes.object.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default LoginMobile;
