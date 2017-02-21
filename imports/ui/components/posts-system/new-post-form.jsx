import React, { PropTypes } from 'react';
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
    <div className="new-post-form-component">
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
    </div>
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

export default NewPostForm;

        /* <Textarea
          fieldName="newPost"
          label=""
          placeholder="Write something..."
          rows={5}
          isRequired={false}
          value={value}
          onChange={onChange}
          // maxLength={Constants.MARKER_DESCRIPTION_MAX_LENGTH}
          displayCounter={false}
          errors={errors}
        />  <TextFieldControlled
          id="newPost"
          hintText="Leave a comment..."
          value={value}
          onChange={onChange}
          fullWidth
          multiLine
          rows={4}
          rowsMax={6}
          errorText={AuxFunctions.getFieldNameErrors(errors, 'newPost')}
        /> <RaisedButton
          // type="submit"
          style={{ marginTop: '14px' }}
          label="Submit"
          onTouchTap={onSubmit}
          // disabled={!canSubmit}
        /> */
