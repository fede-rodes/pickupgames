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
    noResultsOrLoading = <div className="loader">loading...</div>;
  } else if (posts.length === 0) {
    noResultsOrLoading = (
      <div className="no-posts">
        <p>No comments yet!</p>
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
    <div className="posts-system-component">
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
