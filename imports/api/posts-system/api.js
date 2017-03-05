import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import _ from 'underscore';
import Constants from '../constants.js';
import AuxFunctions from '../aux-functions.js';
import PostsSystem from './namespace.js';

//------------------------------------------------------------------------------
/**
* @summary Verify new post fields before inserting doc into database.
*/
PostsSystem.api.checkNewPostFields = (newPost) => {
  // Check arguments
  try {
    check(newPost, {
      postedOn: String,
      content: String,
    });
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  // Destructure
  const {
    postedOn,
    content,
  } = newPost;

  // Initialize errors
  const errors = {
    newPost: [],
  };

  // Checks
  if (!postedOn) {
    throw new Error('postedOn is missing at PostsSystem.api.checkNewPostFields');
  }

  if (!content || content.trim().length === 0) {
    errors.newPost.push('This field is required');
  } else if (content.trim().length > Constants.POST_CONTENT_MAX_LENGTH) {
    errors.newPost.push(`${Constants.POST_CONTENT_MAX_LENGTH} characters maximum`);
  }

  return errors;
};
//------------------------------------------------------------------------------
/**
* @summary Verify edited post fields before updating doc in database.
*/
PostsSystem.api.checkEditPostFields = (editedPost) => {
  // Check arguments
  try {
    check(editedPost, {
      editPostId: String,
      editPostContent: String,
    });
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  // Destructure
  const {
    editPostId,
    editPostContent,
  } = editedPost;

  // Initialize errors
  const errors = {
    editPost: [],
  };

  // Checks
  if (!editPostId) {
    throw new Error('editPostId is missing at PostsSystem.api.checkEditPostFields');
  }

  if (!editPostContent || editPostContent.trim().length === 0) {
    errors.editPost.push('This field is required');
  } else if (editPostContent.trim().length > Constants.POST_CONTENT_MAX_LENGTH) {
    errors.editPost.push(`${Constants.POST_CONTENT_MAX_LENGTH} characters maximum`);
  }

  return errors;
};
//------------------------------------------------------------------------------
