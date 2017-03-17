/* import React, { PropTypes } from 'react';
import { Row, Col, Form, Button } from 'antd';
const FormItem = Form.Item;
import AuxFunctions from '../../../api/aux-functions.js';
import Constants from '../../../api/constants.js';
import InputControlled from '../forms/input-controlled';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const NewPostForm = (props) => {
  const {
    value,
    onChange,
    onSubmit,
    errors,
  } = props;

  return (
    <Form>
      <FormItem
        validateStatus={AuxFunctions.getFieldNameErrors(errors, 'newPost') && 'error' || ''}
        help={AuxFunctions.getFieldNameErrors(errors, 'newPost')}
      >
        <InputControlled
          type="textarea"
          id="newPost"
          placeholder="Leave a comment..."
          value={value}
          onChange={onChange}
          autosize={{ minRows: 2, maxRows: 4 }}
        />
      </FormItem>
      <Button
        type="primary"
        onClick={onSubmit}
        // disabled={!canSubmit}
        size="large"
        // loading={}
      >
        Post
      </Button>
    </Form>
  );
};

NewPostForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    newPost: PropTypes.array,
  }).isRequired,
};

export default NewPostForm; */
