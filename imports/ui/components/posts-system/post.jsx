import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Card, Icon, Form } from 'antd';
const FormItem = Form.Item;
import InputControlled from '../forms/input-controlled';
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
      onSaveEditPostButtonClick,
      onCancelEditPostButtonClick,
      errors,
    } = this.props;

    const { _id, createdAt, createdBy, content, createdByName } = data;

    const editIcons = curUserId && curUserId === createdBy && (
      <div className="relative">
        <div className="absolute inline-block right-0">
          <a href="" onClick={this.handleEditButtonClick}><Icon type="edit" />&nbsp;Edit</a>
          &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
          <a href="" onClick={this.handleDeleteButtonClick}><Icon type="delete" />&nbsp;Delete</a>
        </div>
      </div>
    );

    if (editPostId !== _id) {
      return (
        <Card
          className="mt2 pb2"
          title={<span>{createdByName}</span>}
          extra={<span><Icon type="clock-circle-o" />&nbsp;{moment.utc(createdAt).format('MMM Do YYYY, HH:mm')}</span>}
        >
          <pre>{content}</pre>
          {editIcons}
        </Card>
      );
    }
    return (
      <div className="my3">
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
        <div className="mtn2">
          <a href="#" onClick={onSaveEditPostButtonClick}>save</a>
          &nbsp;&nbsp;-&nbsp;&nbsp;
          <a href="#" onClick={onCancelEditPostButtonClick}>cancel</a>
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
