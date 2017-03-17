import React, { PropTypes } from 'react';
import { Row, Col, Form, Button } from 'antd';
const FormItem = Form.Item;
import AuxFunctions from '../../../api/aux-functions.js';
import Constants from '../../../api/constants.js';
import InputControlled from '../forms/input-controlled';
// import NewPostForm from './new-post-form.jsx';
import Post from './post.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const MobileView = (props) => {
  const {
    reduxState,
    meteorData,
    handleNewPostContentChange,
    handleNewPostSubmit,
    handleEditPostButtonClick,
    handleEditPostContentChange,
    handleSaveEditPostButtonClick,
    handleCancelEditPostButtonClick,
    handleDeletePostButtonClick,
  } = props;

  const { curUserId, postsReady, posts } = meteorData;
  const { editPostId, editPostContent, newPostContent, errors } = reduxState;

  // No results text or loading indicator
  let noResultsOrLoading = null;
  if (!postsReady) {
    noResultsOrLoading = <div>loading...</div>;
  } else if (posts.length === 0) {
    noResultsOrLoading = (
      <div className="mt2">
        <p className="center">No comments yet!</p>
      </div>
    );
  }

  const items = posts.map((post, index) => (
    <Post
      key={index}
      curUserId={curUserId}
      data={post}
      editPostId={editPostId}
      editPostContent={editPostContent}
      onEditPostButtonClick={handleEditPostButtonClick}
      onEditPostContentChange={handleEditPostContentChange}
      onSaveEditPostButtonClick={handleSaveEditPostButtonClick}
      onCancelEditPostButtonClick={handleCancelEditPostButtonClick}
      onDeletePostButtonClick={handleDeletePostButtonClick}
      errors={errors}
    />
  ));

  return (
    <div className="mt3">
      <h2>Comments</h2>
      <Form className="mt1">
        <FormItem
          validateStatus={AuxFunctions.getFieldNameErrors(errors, 'newPost') && 'error' || ''}
          help={AuxFunctions.getFieldNameErrors(errors, 'newPost')}
        >
          <InputControlled
            type="textarea"
            id="newPost"
            placeholder="Leave a comment..."
            value={newPostContent}
            onChange={handleNewPostContentChange}
            autosize={{ minRows: 2, maxRows: 4 }}
          />
        </FormItem>
        <Button
          type="primary"
          onClick={handleNewPostSubmit}
          // disabled={!canSubmit}
          size="large"
          // loading={}
        >
          Post
        </Button>
      </Form>
      {items}
      {noResultsOrLoading}
    </div>
  );
};

MobileView.propTypes = {
  reduxState: PropTypes.shape({
    canSubmitNewPost: PropTypes.bool.isRequired,
    newPostContent: PropTypes.string.isRequired,
    canSubmitEditPost: PropTypes.bool.isRequired,
    editPostId: PropTypes.string.isRequired,
    editPostContent: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      newPost: PropTypes.array,
      editPost: PropTypes.array,
    }).isRequired,
  }).isRequired,
  urlState: PropTypes.shape({
    postedOn: PropTypes.string.isRequired,
  }).isRequired,
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    postsReady: PropTypes.bool.isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        createdAt: PropTypes.instanceOf(Date),
        createdBy: PropTypes.string,
        content: PropTypes.string,
        postedOn: PropTypes.string,
        createdByName: PropTypes.string, // optional
      })
    ).isRequired,
  }).isRequired,
  handleNewPostContentChange: PropTypes.func.isRequired,
  handleNewPostSubmit: PropTypes.func.isRequired,
  handleEditPostButtonClick: PropTypes.func.isRequired,
  handleEditPostContentChange: PropTypes.func.isRequired,
  handleSaveEditPostButtonClick: PropTypes.func.isRequired,
  handleCancelEditPostButtonClick: PropTypes.func.isRequired,
  handleDeletePostButtonClick: PropTypes.func.isRequired,
};

export default MobileView;


/*
import React, { PropTypes } from 'react';
import NewPostForm from './new-post-form.jsx';
import Post from './post.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const MobileView = (props) => {
  const {
    reduxState,
    meteorData,
    handleNewPostContentChange,
    handleNewPostSubmit,
    handleEditPostButtonClick,
    handleEditPostContentChange,
    handleSaveEditPostButtonClick,
    handleCancelEditPostButtonClick,
    handleDeletePostButtonClick,
  } = props;

  const { curUserId, postsReady, posts } = meteorData;
  const { editPostId, editPostContent, newPostContent, errors } = reduxState;

  // No results text or loading indicator
  let noResultsOrLoading = null;
  if (!postsReady) {
    noResultsOrLoading = <div>loading...</div>;
  } else if (posts.length === 0) {
    noResultsOrLoading = (
      <div className="mt2">
        <p className="center">No comments yet!</p>
      </div>
    );
  }

  const items = posts.map((post, index) => (
    <Post
      key={index}
      curUserId={curUserId}
      data={post}
      editPostId={editPostId}
      editPostContent={editPostContent}
      onEditPostButtonClick={handleEditPostButtonClick}
      onEditPostContentChange={handleEditPostContentChange}
      onSaveEditPostButtonClick={handleSaveEditPostButtonClick}
      onCancelEditPostButtonClick={handleCancelEditPostButtonClick}
      onDeletePostButtonClick={handleDeletePostButtonClick}
      errors={errors}
    />
  ));

  return (
    <div className="mt3">
      <h2>Comments</h2>
      <NewPostForm
        value={newPostContent}
        onChange={handleNewPostContentChange}
        onSubmit={handleNewPostSubmit}
        errors={errors}
      />
      {items}
      {noResultsOrLoading}
    </div>
  );
};

MobileView.propTypes = {
  reduxState: PropTypes.shape({
    canSubmitNewPost: PropTypes.bool.isRequired,
    newPostContent: PropTypes.string.isRequired,
    canSubmitEditPost: PropTypes.bool.isRequired,
    editPostId: PropTypes.string.isRequired,
    editPostContent: PropTypes.string.isRequired,
    errors: PropTypes.shape({
      newPost: PropTypes.array,
      editPost: PropTypes.array,
    }).isRequired,
  }).isRequired,
  urlState: PropTypes.shape({
    postedOn: PropTypes.string.isRequired,
  }).isRequired,
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    postsReady: PropTypes.bool.isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        createdAt: PropTypes.instanceOf(Date),
        createdBy: PropTypes.string,
        content: PropTypes.string,
        postedOn: PropTypes.string,
        createdByName: PropTypes.string, // optional
      })
    ).isRequired,
  }).isRequired,
  handleNewPostContentChange: PropTypes.func.isRequired,
  handleNewPostSubmit: PropTypes.func.isRequired,
  handleEditPostButtonClick: PropTypes.func.isRequired,
  handleEditPostContentChange: PropTypes.func.isRequired,
  handleSaveEditPostButtonClick: PropTypes.func.isRequired,
  handleCancelEditPostButtonClick: PropTypes.func.isRequired,
  handleDeletePostButtonClick: PropTypes.func.isRequired,
};

export default MobileView;

*/
