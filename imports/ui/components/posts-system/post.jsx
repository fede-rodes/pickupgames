import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Card, Icon, Popover, Form } from 'antd';
const FormItem = Form.Item;
import InputControlled from '../forms/input-controlled';
// import TextFieldControlled from '../forms/text-field-controlled';
// import RaisedButton from 'material-ui/RaisedButton';
import AuxFunctions from '../../../api/aux-functions.js';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class Post extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleEditPostContentChange = this.handleEditPostContentChange.bind(this);
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
  }

  handleEditButtonClick(e) {
    e.preventDefault();
    // Get context
    const { data, onEditPostButtonClick } = this.props;
    // Pass data up to parent component
    onEditPostButtonClick(data._id); // postId
  }

  handleEditPostContentChange({ value }) { // { fieldName, value }
    // Get context
    const { onEditPostContentChange } = this.props;
    // Pass data up to parent component
    onEditPostContentChange(value);
  }

  handleDeleteButtonClick(e) {
    e.preventDefault();
    // Get context
    const { data, onDeletePostButtonClick } = this.props;
    // Pass data up to parent component
    onDeletePostButtonClick(data._id); // postId
  }

  render() {
    // Get context
    const {
      curUserId,
      data,
      editPostId,
      editPostContent,
      // onEditPostButtonClick,
      // onEditPostContentChange,
      onSaveEditPostButtonClick,
      onCancelEditPostButtonClick,
      errors,
    } = this.props;

    const { _id, createdAt, createdBy, content, createdByName } = data;

    /* const editDeleteButtons = (
      <div>
        <p><Icon type="delete" />&nbsp;<a href="" onClick={this.handleEditButtonClick}>Edit</a></p>
        <p><Icon type="edit" />&nbsp;<a href="" onClick={this.handleDeleteButtonClick}>Delete</a></p>
      </div>
    ); */

    /* const editIcons = curUserId && curUserId === createdBy && (
      <div className="icons-container">
        <Popover content={editDeleteButtons} trigger="click">
          <Icon
            type="ellipsis"
            style={{ float: 'right', cursor: 'pointer', position: 'relative', bottom: '-20px', fontSize: '20px' }}
          />
        </Popover>
      </div>
    ); */

    const editIcons = curUserId && curUserId === createdBy && (
      <div className="icons-container">
        <div style={{ float: 'right', cursor: 'pointer', position: 'relative', bottom: '-10px' }}>
          <a href="" onClick={this.handleEditButtonClick}><Icon type="edit" />&nbsp;Edit</a>
          &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
          <a href="" onClick={this.handleDeleteButtonClick}><Icon type="delete" />&nbsp;Delete</a>
        </div>
      </div>
    );

    if (editPostId !== _id) {
      return (
        <Card
          className="post-component top-gap"
          title={<span><Icon type="user" />&nbsp;{createdByName}</span>}
          extra={<span><Icon type="clock-circle-o" />&nbsp;{moment.utc(createdAt).format('ddd, MMM Do YYYY, HH:mm')}</span>}
        >
          <pre>{content}</pre>
          {editIcons}
        </Card>
      );
    }
    return (
      <div className="edit-post-component">
        <Form>
          <FormItem
            validateStatus={AuxFunctions.getFieldNameErrors(errors, 'editPost') && 'error' || ''}
            help={AuxFunctions.getFieldNameErrors(errors, 'editPost')}
          >
            <InputControlled
              type="textarea"
              id="editPost"
              value={editPostContent}
              onChange={this.handleEditPostContentChange}
              autosize={{ minRows: 2, maxRows: 4 }}
            />
          </FormItem>
        </Form>
        <div className="buttons-container">
          <span onClick={onSaveEditPostButtonClick}>save</span>
          &nbsp;&nbsp;-&nbsp;&nbsp;
          <span onClick={onCancelEditPostButtonClick}>cancel</span>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  curUserId: PropTypes.string,
  data: PropTypes.shape({
    _id: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    createdBy: PropTypes.string,
    content: PropTypes.string,
    postedOn: PropTypes.string,
    createdByName: PropTypes.string, // optional
  }).isRequired,
  editPostId: PropTypes.string.isRequired,
  editPostContent: PropTypes.string.isRequired,
  onEditPostButtonClick: PropTypes.func.isRequired,
  onEditPostContentChange: PropTypes.func.isRequired,
  onSaveEditPostButtonClick: PropTypes.func.isRequired,
  onCancelEditPostButtonClick: PropTypes.func.isRequired,
  onDeletePostButtonClick: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    newPost: PropTypes.array,
    editPost: PropTypes.array,
  }).isRequired,
};

export default Post;
