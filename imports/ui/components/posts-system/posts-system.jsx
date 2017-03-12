import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'underscore';
import { Bert } from 'meteor/themeteorchef:bert';
import Actions from '../../../api/redux/client/actions.js';
import AuxFunctions from '../../../api/aux-functions.js';
import PostsSystem from '../../../api/posts-system/namespace.js';
import '../../../api/posts-system/api.js'; // PostsSystem.api
import '../../../api/posts-system/collection.js'; // PostsSystem.collection
import MobileView from './mobile-view.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
/**
* @summary Contains all the 'Page' logic and takes care of view dispatching.
* Actions should be dispatched here and NOT in any child component!
*/
class PostsSystemComponent extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleNewPostContentChange = this.handleNewPostContentChange.bind(this);
    this.handleNewPostSubmit = this.handleNewPostSubmit.bind(this);
    this.handleEditPostButtonClick = this.handleEditPostButtonClick.bind(this);
    this.handleEditPostContentChange = this.handleEditPostContentChange.bind(this);
    this.handleSaveEditPostButtonClick = this.handleSaveEditPostButtonClick.bind(this);
    this.handleCancelEditPostButtonClick = this.handleCancelEditPostButtonClick.bind(this);
    this.handleDeletePostButtonClick = this.handleDeletePostButtonClick.bind(this);
  }

  // TODO: check for user login state in all methods
  handleNewPostContentChange({ value }) { // { fieldName, value }
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateTextField('newPostContent', value);

    // Clear errors if any
    if (errors.newPost.length > 0) {
      reduxActions.dispatchClearErrors('newPost');
    }
  }

  handleNewPostSubmit(evt) {
    evt.preventDefault();

    const { reduxState, reduxActions, urlState } = this.props;
    const { newPostContent } = reduxState;
    const { postedOn } = urlState;

    // Disable submit post button
    reduxActions.dispatchSetBooleanField('canSubmitNewPost', false);

    const newPost = {
      postedOn,
      content: newPostContent,
    };

    // Check for errors
    const errors = PostsSystem.api.checkNewPostFields(newPost);

    if (AuxFunctions.hasErrors(errors)) {
      // Attach new errors to existing ones
      const oldErrors = reduxState.errors;
      reduxActions.dispatchSetErrors(_.extend(oldErrors, errors));
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmitNewPost', true);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      return;
    }

    Meteor.call('PostsSystem.methods.createPost', newPost, (err) => {
      if (err) {
        Bert.alert(err.reason, 'danger', 'growl-top-right');
      } else {
        // Clear new post form content
        reduxActions.dispatchClearTextField('newPostContent');
      }
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmitNewPost', true);
    });
  }

  handleEditPostButtonClick(postId) {
    const { reduxState, reduxActions, meteorData } = this.props;
    const { errors } = reduxState;
    const { posts } = meteorData;

    // Get selected post content
    const index = _.indexOf(_.pluck(posts, '_id'), postId);
    if (index === -1) {
      throw new Error('wrong value at handleEditPostButtonClick');
    }
    const selectedPost = posts[index];

    reduxActions.dispatchUpdateTextField('editPostId', postId);
    reduxActions.dispatchUpdateTextField('editPostContent', selectedPost.content);

    // Clear errors if any
    if (errors.editPost.length > 0) {
      reduxActions.dispatchClearErrors('editPost');
    }
  }

  handleEditPostContentChange(value) {
    const { reduxState, reduxActions } = this.props;
    const { errors } = reduxState;

    reduxActions.dispatchUpdateTextField('editPostContent', value);

    // Clear errors if any
    if (errors.editPost.length > 0) {
      reduxActions.dispatchClearErrors('editPost');
    }
  }

  handleSaveEditPostButtonClick(e) {
    e.preventDefault();
    const { reduxState, reduxActions } = this.props;

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmitEditPost', false);

    // Get context
    const editedPost = _.pick(reduxState, 'editPostId', 'editPostContent');

    // Check for errors
    const errors = PostsSystem.api.checkEditPostFields(editedPost);

    if (AuxFunctions.hasErrors(errors)) {
      // Attach new errors to existing ones
      const oldErrors = reduxState.errors;
      reduxActions.dispatchSetErrors(_.extend(oldErrors, errors));
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmitEditPost', true);
      // Display flash notification
      Bert.alert('The form has errors', 'danger', 'growl-top-right');
      return;
    }

    Meteor.call('PostsSystem.methods.editPost', editedPost, (err) => {
      if (err) {
        Bert.alert(err.reason, 'danger', 'growl-top-right');
      } else {
        // Clear edit post form content
        reduxActions.dispatchClearTextField('editPostId');
        reduxActions.dispatchClearTextField('editPostContent');
      }
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmitEditPost', true);
    });
  }

  handleCancelEditPostButtonClick(e) {
    e.preventDefault();
    const { reduxActions } = this.props;

    reduxActions.dispatchClearTextField('editPostId');
    reduxActions.dispatchClearTextField('editPostContent');
  }

  handleDeletePostButtonClick(postId) {
    const { reduxActions } = this.props;

    // Disable submit button
    reduxActions.dispatchSetBooleanField('canSubmitDeletePost', false);

    Meteor.call('PostsSystem.methods.deletePost', postId, (err) => {
      if (err) {
        Bert.alert(err.reason, 'danger', 'growl-top-right');
      } else {
        // Clear edit post form content
        reduxActions.dispatchClearTextField('editPostId');
        reduxActions.dispatchClearTextField('editPostContent');
      }
      // Re-enable submit button
      reduxActions.dispatchSetBooleanField('canSubmitDeletePost', true);
    });
  }

  render() {
    const { reduxState, urlState, meteorData } = this.props;

    return (
      <MobileView
        // pass data down
        reduxState={reduxState}
        urlState={urlState}
        meteorData={meteorData}
        // pass methods down
        handleNewPostContentChange={this.handleNewPostContentChange}
        handleNewPostSubmit={this.handleNewPostSubmit}
        handleEditPostButtonClick={this.handleEditPostButtonClick}
        handleEditPostContentChange={this.handleEditPostContentChange}
        handleSaveEditPostButtonClick={this.handleSaveEditPostButtonClick}
        handleCancelEditPostButtonClick={this.handleCancelEditPostButtonClick}
        handleDeletePostButtonClick={this.handleDeletePostButtonClick}
      />
    );
  }
}

PostsSystemComponent.propTypes = {
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
  reduxActions: PropTypes.object.isRequired,
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
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'postsSystem';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current component (namespace).
  const reduxActions = {
    dispatchUpdateTextField(fieldName, value) {
      return dispatch(Actions.updateTextField(namespace, fieldName, value));
    },
    dispatchClearTextField(fieldName) {
      return dispatch(Actions.clearTextField(namespace, fieldName));
    },
    dispatchSetBooleanField(fieldName, value) {
      return dispatch(Actions.setBooleanField(namespace, fieldName, value));
    },
    dispatchSetErrors(errorsObj) {
      return dispatch(Actions.setErrors(namespace, errorsObj));
    },
    dispatchClearErrors(fieldName) {
      return dispatch(Actions.clearErrors(namespace, fieldName));
    },
  };

  return { reduxActions };
}
//------------------------------------------------------------------------------
// PAGE CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const PostsSystemContainer = createContainer(({ postedOn }) => {
  // Subscribe to posts + posts created by users
  const subs1 = Meteor.subscribe('PostsSystem.publications.getPosts', postedOn);
  const options = { sort: { createdAt: -1 } };
  const posts = PostsSystem.collection.find({ postedOn }, options).map((post) => {
    // Attach username to post
    _.extend(post, {
      createdByName: Meteor.users.findOne({ _id: post.createdBy }).profile.name,
    });
    return post;
  });

  return {
    meteorData: {
      curUserId: Meteor.userId(), // could be undefined
      postsReady: subs1.ready(),
      posts,
    },
    urlState: {
      postedOn,
    },
  };
}, connect(mapStateToProps, mapDispatchToProps)(PostsSystemComponent));

export default PostsSystemContainer;
