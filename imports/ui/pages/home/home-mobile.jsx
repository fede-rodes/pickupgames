import React, { PropTypes } from 'react';
import { Form } from 'antd';
const FormItem = Form.Item;
import DefaultLayoutContainer from '../../layouts/default-layout.jsx';
import GoogleAutoCompleteControlled from '../../components/forms/google-auto-complete-controlled.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const HomeMobile = (props) => {
  const {
    reduxState,
    handleSearchTextChange,
    handleLocationOptionSelect,
  } = props;

  const { searchText, errors } = reduxState;

  return (
    <DefaultLayoutContainer width="600px" padding="20px 15px 0" withHeader={false}>
      <img
        src="/images/logo.png"
        alt="logo"
        className="block my0 mx-auto"
        style={{ width: '100%', maxWidth: '300px' }}
      />
      <h1 className="center">
        Find pick-up games in your <br /> city or neighborhood...
      </h1>
      <Form className="block mt1 mx-auto" style={{ maxWidth: '300px' }}>
        <FormItem>
          <GoogleAutoCompleteControlled
            id="searchText"
            placeholder="Enter City or Postcode."
            value={searchText}
            onChange={handleSearchTextChange}
            onSelect={handleLocationOptionSelect}
            // errorText={AuxFunctions.getFieldNameErrors(errors, 'searchText')}
          />
        </FormItem>
      </Form>
    </DefaultLayoutContainer>
  );
};

HomeMobile.propTypes = {
  reduxState: PropTypes.shape({
    searchText: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
  }).isRequired,
  handleSearchTextChange: PropTypes.func.isRequired,
  handleLocationOptionSelect: PropTypes.func.isRequired,
};

export default HomeMobile;
